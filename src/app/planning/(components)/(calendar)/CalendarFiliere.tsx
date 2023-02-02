import FullCalendar from "@/components/calendar/fullCalendar/FullCalendar";
import { CommonCalendarProps } from "@/components/calendar/types";
import { toCalendarData } from "@/lib/calendar";
import { ModuleEvent, RawModule } from "@/lib/types";
import { useMemo, useState } from "react";
import { FiliereView } from "./CalendarView";

export default function CalendarFiliere({
  modules: originalModules,
  day,
  event,
  ...props
}: { modules: RawModule[] } & CommonCalendarProps<ModuleEvent>) {
  const [modules, setModules] = useState(originalModules);
  const calendarData = useMemo(() => {
    const data = toCalendarData(modules, "filiere", FiliereView);
    // checkOverlapModules(data);
    return data;
  }, [modules]);
  //   const { showOverlapModules, draggedModule, setDraggedModule } = useCalendar();
  //   // DropTarget: interval de drop
  //   const [dropTarget, setDropTarget] = useState(null);

  //   const isDropTarget = useCallback(
  //     (day) => {
  //       return dropTarget && isWithinInterval(day, dropTarget);
  //     },
  //     [dropTarget]
  //   );

  //   const cleanDropTarget = () => {
  //     setDropTarget(null);
  //   };

  //   const changeDropTarget = useCallback(
  //     (dayAndEvent, evt) => {
  //       let targetDay;
  //       if (!dayAndEvent.event || dayAndEvent.event.duration == 1) {
  //         // Simple day or single day event
  //         targetDay = dayAndEvent.date;
  //       } else {
  //         // Day with event accross multiple days
  //         // Calculate on which day it was droped
  //         let rect = evt.currentTarget.getBoundingClientRect();
  //         targetDay = getTargetDay(dayAndEvent.event, {
  //           targetWidth: evt.currentTarget.clientWidth,
  //           mouseOffsetX: evt.clientX - rect.x,
  //         });
  //       }
  //       if (!dropTarget || !isSameDay(targetDay, dropTarget.start)) {
  //         setDropTarget({
  //           start: targetDay,
  //           end: addDays(targetDay, draggedModule().duration - 1),
  //         });
  //       }
  //     },
  //     [dropTarget]
  //   );

  //   const dropModule = useCallback(() => {
  //     const newModules = modules.filter((m) => m.id != draggedModule().id);
  //     let newModule = draggedModule();
  //     newModule.start = formatISO(dropTarget.start);
  //     newModule.end = formatISO(dropTarget.end);
  //     newModules.push(newModule);
  //     setModules(newModules);
  //     cleanDropTarget();
  //   }, [modules, dropTarget]);

  return (
    <FullCalendar
      {...props}
      data={calendarData}
      //   EventTooltip={FiliereView.EventTooltip}
      LabelComponent={FiliereView.LabelComponent}
      day={{
        ...day,
        styleProps: (date) => {
          let style = { ...day.styleProps(date) };
          //   if (isDropTarget(date)) style.backgroundColor = "#D6C588";
          return style;
        },
      }}
      event={{
        ...event,
        onClick: (mod, ref) => {
          if (mod.overlap) {
            // showOverlapModules(mod, ref);
            console.log("TODO module overlap");
          } else event.onClick(mod, ref);
        },
      }}
      //   drag={{
      //     drag: (dayAndEvent, row, evt) => {
      //       if (!dayAndEvent.event.overlap) setDraggedModule(dayAndEvent.event);
      //       else evt.preventDefault();
      //     },
      //     enter: (dayAndEvent, row, evt) => {
      //       if (draggedModule().filiere !== row) {
      //         cleanDropTarget();
      //         return;
      //       }
      //       changeDropTarget(dayAndEvent, evt);
      //     },
      //     leave: (dayAndEvent, row, evt) => {
      //       if (draggedModule().filiere !== row) cleanDropTarget();
      //     },
      //     drop: (dayAndEvent, row, evt) => {
      //       if (draggedModule().filiere !== row) {
      //         cleanDropTarget();
      //         return;
      //       }
      //       dropModule();
      //     },
      //     move: (dayAndEvent, row, evt) => {
      //       evt.preventDefault();
      //       if (draggedModule().filiere !== row) {
      //         cleanDropTarget();
      //         return;
      //       }
      //       changeDropTarget(dayAndEvent, evt);
      //     },
      //   }}
    />
  );
}
