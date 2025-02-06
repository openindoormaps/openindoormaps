import { ControlPosition, IControl } from "maplibre-gl";

export default class OIMLogo implements IControl {
  private container!: HTMLDivElement;

  getDefaultPosition(): ControlPosition {
    return "bottom-left";
  }

  onAdd(): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl";
    this.container.style.pointerEvents = "auto";
    this.container.innerHTML = `
    <a 
      href="https://github.com/openindoormap/openindoormaps" 
      target="_blank" 
      class="flex space-x-2 p-2"
      aria-label="OpenIndoorMaps">
      <picture>
        <source media="(max-width: 640px)" srcset="/assets/oim-ctrl-logo-sm.svg">
        <img src="/assets/oim-ctrl-logo.svg" alt="OpenIndoorMaps" class="h-7 w-auto" />
      </picture>
    </a>
    `;
    return this.container;
  }

  onRemove(): void {
    this.container.remove();
  }
}
