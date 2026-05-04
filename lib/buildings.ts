/**
 * Shared list of buildings managed by Batima Gest.
 * Update this file to add/remove buildings across the entire app.
 */
export const BUILDINGS = [
  { id: "tower-a",     name: "Tour A",       info: "12 étages · 48 appartements" },
  { id: "tower-b",     name: "Tour B",       info: "10 étages · 40 appartements" },
  { id: "residence-c", name: "Résidence C",  info: "6 étages · 24 appartements" },
  { id: "villa-d",     name: "Villa D",      info: "3 étages · 12 appartements" },
  { id: "parc-e",      name: "Parc E",       info: "8 étages · 32 appartements" },
  { id: "other",       name: "Autre",        info: "Précisez dans le champ ci-dessous" },
] as const

export type BuildingName = typeof BUILDINGS[number]["name"]
