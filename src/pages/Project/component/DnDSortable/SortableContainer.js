import { Flex, Image } from '@chakra-ui/react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import React, { useEffect, useMemo, useState } from 'react';
import SortableItem from './SortableItem';

const SortableContainer = (props) => {
  const {
    items: files,
    setItems,
    itemAction
  } = props;
  
  const [activeId, setActiveId] = useState(null);
  const itemIds = useMemo(() => files.map((file, idx) => idx.toString()), [files]);


  useEffect(() => {
    
  }, [files.length])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((files) => {
        const oldIndex = parseInt(active.id);
        const newIndex = parseInt(over.id);
        return arrayMove(files, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <Flex
        wrap={'wrap'}
        direction={"row"}
        w={['100%', '660px']}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          {itemIds.map((id, idx) => (
            <SortableItem key={id} id={id} handle={true} value={id}
            file={files[id]}
            idx={idx}
            itemAction={itemAction}>
            </SortableItem>
          ))}
          <DragOverlay>
            {activeId ? (
              <Image
              src={files[activeId].originalType === 1 ? files[activeId].thumbnail : files[activeId].original || URL.createObjectURL(files[activeId])}
              fit={'cover'}
              opacity={'0.5'}
          />
            ) : null}
          </DragOverlay>
        </SortableContext>
      </Flex>
    </DndContext>
  );
};

export default SortableContainer;
