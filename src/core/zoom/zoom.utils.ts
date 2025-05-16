import {
  BoundsType,
  PositionType,
  ReactZoomPanPinchContext,
} from "../../models";
import { getMouseBoundedPosition } from "../bounds/bounds.utils";

export function handleCalculateZoomPositions(
  contextInstance: ReactZoomPanPinchContext,
  mouseX: number,
  mouseY: number,
  newScale: number,
  bounds: BoundsType,
  limitToBounds: boolean,
): PositionType {
  const { scale, positionX, positionY } = contextInstance.transformState;
  const { wrapperComponent } = contextInstance;
  const scaleDifference = newScale - scale;
  
  if (typeof mouseX !== "number" || typeof mouseY !== "number") {
    console.error("Mouse X and Y position were not provided!");
    return { x: positionX, y: positionY };
  }
  
  // 스크롤된 위치를 고려한 마우스 위치 계산
  let effectiveMouseX = mouseX;
  let effectiveMouseY = mouseY;
  
  // 스크롤 위치가 이미 mouseX, mouseY에 반영되어 있지 않다면, 여기서 추가해야 함
  // 이 함수가 외부 이벤트 핸들러에서 호출될 때를 위한 코드
  if (wrapperComponent && 
      mouseX < wrapperComponent.offsetWidth && 
      mouseY < wrapperComponent.offsetHeight) {
    const scrollLeft = wrapperComponent.scrollLeft || 0;
    const scrollTop = wrapperComponent.scrollTop || 0;
    effectiveMouseX += scrollLeft;
    effectiveMouseY += scrollTop;
  }
  
  const calculatedPositionX = positionX - effectiveMouseX * scaleDifference;
  const calculatedPositionY = positionY - effectiveMouseY * scaleDifference;
  
  const newPositions = getMouseBoundedPosition(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds,
    0,
    0,
    null,
  );
  return newPositions;
}

export function checkZoomBounds(
  zoom: number,
  minScale: number,
  maxScale: number,
  zoomPadding: number,
  enablePadding: boolean,
): number {
  const scalePadding = enablePadding ? zoomPadding : 0;
  const minScaleWithPadding = minScale - scalePadding;

  if (!Number.isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!Number.isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return zoom;
}
