import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Sortable = forwardRef(({ tokens }, ref) => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    setGallery(tokens);
  }, [tokens]);

  useImperativeHandle(ref, () => ({
    gallery
  }));

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(gallery[sInd], source.index, destination.index);
      const newState = [...gallery];
      newState[sInd] = items;
      setGallery(newState);
    } else {
      const result = move(gallery[sInd], gallery[dInd], source, destination);
      const newState = [...gallery];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setGallery(newState.filter(group => group.length));
    }
  }

  return (
    <div>
      <div className="flex gap-2 font-bold text-white text-center">
        <div className="p-2 w-1/2 bg-neutral-400">Gallery</div>
        <div className="p-2 w-1/2 bg-neutral-400">Hidden</div>
      </div>
      <div className="flex gap-2">
        <DragDropContext onDragEnd={onDragEnd}>
          {gallery.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  className={`w-1/2 ${snapshot.isDraggingOver && (provided.droppableProps["data-rfd-droppable-id"] == 1 ? 'bg-red-300' : 'bg-emerald-200')}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="p-4 mb-2 bg-neutral-100"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex gap-8">
                            <img src={item?.content?.files[0]?.cdn_uri ? item?.content?.files[0]?.cdn_uri : item?.content?.files[0]?.uri} className="h-24 w-24 object-center object-cover" />
                            <div className="font-bold text-lg">{item?.content?.metadata.name}</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
})

export default Sortable;
