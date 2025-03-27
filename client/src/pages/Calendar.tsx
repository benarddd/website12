import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DayContentProps } from "react-day-picker";
import SchoolLogo from "@/components/SchoolLogo";

interface CalendarEvent {
  date: Date;
  title: string;
  type: "holiday" | "activity" | "exam";
  description: string;
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  
  // Sample events data - this would typically come from an API
  const events: CalendarEvent[] = [
    {
      date: new Date(2025, 2, 31), // Pashket
      title: "Pashket",
      type: "holiday",
      description: "Festimi i ditës së Pashkeve Katolike"
    },
    {
      date: new Date(2025, 4, 1), // May 1, 2025
      title: "Dita e Punëtorëve",
      type: "holiday",
      description: "Festë kombëtare - Shkolla e mbyllur"
    },
    {
      date: new Date(2025, 5, 1), // June 1, 2025
      title: "Dita e Fëmijëve",
      type: "activity",
      description: "Aktivitete të ndryshme për ditën e fëmijëve"
    },
    {
      date: new Date(2025, 5, 15), // June 15, 2025
      title: "Ceremonia e Diplomimit",
      type: "activity",
      description: "Ceremonia e diplomimit për klasat e 12-ta"
    }
  ];
  
  // Update selected day events when date changes
  useEffect(() => {
    if (date) {
      const dayEvents = events.filter(event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
      );
      setSelectedDayEvents(dayEvents);
    } else {
      setSelectedDayEvents([]);
    }
  }, [date]);
  
  // Function to get events for a specific date (used for highlighting dates with events)
  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.getDate() === day.getDate() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  return (
    <div className="min-h-screen bg-[#121212] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Kalendari Shkollor</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Shiko të gjitha aktivitetet, pushimet dhe ngjarjet shkollore për vitin akademik
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-2 bg-[#1e1e1e] rounded-xl p-6 shadow-lg"
          >
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md bg-[#1e1e1e] border-[#333] text-white"
              modifiers={{
                holiday: events
                  .filter(event => event.type === "holiday")
                  .map(event => event.date),
                activity: events
                  .filter(event => event.type === "activity")
                  .map(event => event.date),
                exam: events
                  .filter(event => event.type === "exam")
                  .map(event => event.date),
              }}
              modifiersStyles={{
                holiday: { 
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "rgb(239, 68, 68)",
                  fontWeight: "bold"
                },
                activity: { 
                  backgroundColor: "rgba(38, 166, 154, 0.15)",
                  color: "rgb(38, 166, 154)",
                  fontWeight: "bold"
                },
                exam: { 
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "rgb(245, 158, 11)",
                  fontWeight: "bold"
                },
              }}
              components={{
                DayContent: (props: DayContentProps) => {
                  const dayEvents = getDayEvents(props.date);
                  return (
                    <div className="relative">
                      <div>{props.date.getDate()}</div>
                      {dayEvents.length > 0 && (
                        <div className="flex absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div 
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                event.type === 'holiday' ? 'bg-red-500' : 
                                event.type === 'activity' ? 'bg-[#26a69a]' : 'bg-amber-500'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 bg-[#1e1e1e] rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {date ? date.toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Zgjidhni një datë'}
            </h2>
            
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((event, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[#252525] p-4 rounded-lg border-l-4 border-opacity-80"
                    style={{ 
                      borderColor: event.type === 'holiday' ? 'rgb(239, 68, 68)' : 
                                  event.type === 'activity' ? 'rgb(38, 166, 154)' : 'rgb(245, 158, 11)' 
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-white">{event.title}</h3>
                      <Badge 
                        className={`${
                          event.type === 'holiday' ? 'bg-red-500/10 text-red-500' : 
                          event.type === 'activity' ? 'bg-[#26a69a]/10 text-[#26a69a]' : 
                          'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {event.type === 'holiday' ? 'Pushim' : 
                         event.type === 'activity' ? 'Aktivitet' : 'Provim'}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Nuk ka ngjarje për datën e zgjedhur</p>
            )}
            
            <div className="mt-6 pt-4 border-t border-[#333]">
              <h3 className="font-semibold text-white mb-3">Legjenda:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#26a69a] mr-2"></div>
                  <span className="text-sm text-gray-300">Aktivitete</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Pushime</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Provime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}