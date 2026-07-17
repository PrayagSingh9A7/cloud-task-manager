import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { analyticsAPI, taskAPI } from '../services/api';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { withDragAndDrop } from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

// Subcomponent Module Injections
import { TaskStats } from '../components/calendar/TaskStats';
import { CalendarFilters } from '../components/calendar/CalendarFilters';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar';
import { TaskSidebar } from '../components/calendar/TaskSidebar';
import { EventCard } from '../components/calendar/EventCard';
import { TaskDetailsModal } from '../components/calendar/TaskDetailsModal';
import { TaskModal } from '../components/TaskModal';

// External style layout components binding
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DragAndDropCalendar = typeof withDragAndDrop === 'function' 
  ? withDragAndDrop(Calendar) 
  : Calendar;

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);
  
  // FIX: Explicitly control the active view state values locally
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  // Modals and Detailed view tracks
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Granular Filter Matrices States
  const [filters, setFilters] = useState({ search: '', priority: '', status: '', category: '' });

  const fetchCalendarTimeline = async () => {
    try {
      setLoading(true);
      setErrorState(false);
      const res = await analyticsAPI.getCalendar();

      if (!res || !res.data || !Array.isArray(res.data)) {
        setEvents([]);
        return;
      }

      const formatted = res.data.map(node => {
        const startStamp = new Date(node.start);
        const endStamp = new Date(node.end || node.start);

        if (isNaN(startStamp.getTime()) || isNaN(endStamp.getTime())) return null;

        return {
          id: node.id,
          title: node.title || 'Untitled Task',
          start: startStamp,
          end: endStamp,
          allDay: node.allDay ?? true,
          resource: {
            priority: node.resource?.priority || 'medium',
            status: node.resource?.status || 'todo',
            category: node.resource?.category || 'General',
            description: node.resource?.description || ''
          }
        };
      }).filter(n => n !== null);

      setEvents(formatted);
    } catch (err) {
      console.error("Critical timeline resolution matrix exception:", err);
      setErrorState(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarTimeline();
  }, []);

  // Filter criteria computation matching query hooks
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchSearch = filters.search === '' || evt.title.toLowerCase().includes(filters.search.toLowerCase());
      const matchPriority = filters.priority === '' || evt.resource?.priority === filters.priority;
      const matchStatus = filters.status === '' || evt.resource?.status === filters.status;
      const matchCategory = filters.category === '' || evt.resource?.category.toLowerCase().includes(filters.category.toLowerCase());
      return matchSearch && matchPriority && matchStatus && matchCategory;
    });
  }, [events, filters]);

  // Handle runtime state mutations triggered by direct UI events
  const updateFilter = useCallback((key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  }, []);

  // FIX: Local View Navigation State Interceptors
  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
  }, []);

  // Core Mutation Direct Calls to taskAPI Architecture
  const handleStatusChange = async (id, status) => {
    try {
      await taskAPI.patchStatus(id, status);
      await fetchCalendarTimeline();
    } catch (err) {
      alert("Operational constraint update failure.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      await fetchCalendarTimeline();
    } catch (err) {
      alert("Error dropping document element from Cloudant store.");
    }
  };

  const handleDuplicateTask = async (id) => {
    try {
      await taskAPI.duplicateTask(id);
      await fetchCalendarTimeline();
    } catch (err) {
      alert("Duplication process terminated via backend proxy rules.");
    }
  };

  const handleCreateTask = async (data) => {
    try {
      await taskAPI.createTask(data);
      await fetchCalendarTimeline();
    } catch (err) {
      alert("Failed creating task cluster reference.");
    }
  };

  // Drag-and-Drop Mutation Logic Pipeline
  const moveEvent = async ({ event, start, end }) => {
    try {
      const updatedEvent = {
        title: event.title,
        dueDate: start.toISOString(),
        priority: event.resource?.priority,
        category: event.resource?.category,
        description: event.resource?.description,
        status: event.resource?.status
      };
      
      await taskAPI.updateTask(event.id, updatedEvent);
      
      setEvents(prev => prev.map(evt => 
        evt.id === event.id ? { ...evt, start, end } : evt
      ));
    } catch (err) {
      console.error("Failed to commit drag event mapping to Cloudant document:", err);
      alert("Failed to synchronize calendar drag event mapping.");
    }
  };

  const eventStyleGetter = useCallback((event) => {
    const borders = { high: 'border-red-500/80', medium: 'border-amber-500/80', low: 'border-emerald-500/80' };
    return {
      className: `bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 border-l-4 ${borders[event.resource?.priority || 'medium']} shadow-soft-sm rounded-lg hover:shadow-soft-md transition-all`
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-5">
        
        {/* Top Operational Stats Component */}
        <TaskStats events={events} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary-light dark:text-white">Task Calendar</h1>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
              Manage your tasks and deadlines visually.
            </p>
          </div>
        </div>

        {/* Granular Filters Grid Row */}
        <CalendarFilters filters={filters} onFilterChange={updateFilter} />

        {/* Master Context Grid Canvas */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-soft-sm calendar-premium-wrapper">
            {loading ? (
              <div className="space-y-4">
                <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-[500px] w-full bg-slate-50 dark:bg-slate-800/40 rounded-lg animate-pulse" />
              </div>
            ) : errorState ? (
              <div className="py-24 text-center text-red-500 font-medium text-xs">
                Synchronized data pipeline broke. Check IBM Cloud Cloudant connectivity mappings.
              </div>
            ) : filteredEvents.length === 0 && filters.search !== '' ? (
              <div className="py-32 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <p className="text-sm text-slate-400">No matching scheduled entities found.</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-900 dark:text-slate-100">
                <DragAndDropCalendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  
                  // FIX: Explicit Controlled Binding Maps
                  date={currentDate}
                  view={currentView}
                  onNavigate={handleNavigate}
                  onView={handleViewChange}

                  resizable={true}
                  selectable={true}
                  onEventDrop={moveEvent}
                  onEventResize={moveEvent}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  components={{
                    toolbar: CalendarToolbar,
                    event: EventCard
                  }}
                  className="h-[600px] text-xs font-medium"
                />
              </motion.div>
            )}
          </div>

          {/* Contextual Agenda Sidebar Element */}
          <TaskSidebar events={events} onSelectEvent={handleSelectEvent} />
        </div>
      </div>

      {/* Primary Global Mutation Triggers FAB UI element */}
      <motion.button 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white shadow-soft-lg hover:bg-indigo-500 z-40 cursor-pointer flex items-center justify-center"
      >
        <Plus size={20} strokeWidth={2.5} />
      </motion.button>

      {/* Structural Interactive Modals Controls Overlay Layout */}
      <AnimatePresence>
        {isDetailsOpen && (
          <TaskDetailsModal 
            isOpen={isDetailsOpen} 
            onClose={() => setIsDetailsOpen(false)} 
            event={selectedEvent} 
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
          />
        )}
      </AnimatePresence>

      <TaskModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateTask} />
    </Layout>
  );
}