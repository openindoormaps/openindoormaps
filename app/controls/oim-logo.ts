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
      href="https://github.com/openindoormaps/openindoormaps" 
      target="_blank" 
      class="flex items-center space-x-1 p-2"
      aria-label="OpenIndoorMaps">
      <img src="/images/oim-ctrl-logo.svg" alt="OpenIndoorMaps" class="h-7 w-auto" />
      <img src="/images/oim-ctrl-logo-text.svg" alt="OpenIndoorMaps" class="hidden h-7 w-auto dark:invert md:block" />
    </a>
    `;
    return this.container;
  }

  onRemove(): void {
    this.container.remove();
  }
}
