"use client"

import { useEffect, useRef } from "react"
import type { Milestone } from "@/lib/types"

interface DependencyChartProps {
  milestones: Milestone[]
}

export default function DependencyChart({ milestones }: DependencyChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Simple visualization for task dependencies
    if (!containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ""

    const width = container.clientWidth
    const height = container.clientHeight

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", `${width}`)
    svg.setAttribute("height", `${height}`)
    svg.style.overflow = "visible"
    container.appendChild(svg)

    // Calculate positions
    const nodeHeight = 40
    const nodeWidth = 150
    const horizontalSpacing = Math.min(width / 3, 200)
    const verticalSpacing = Math.min(height / (milestones.length + 1), 70)

    // Create nodes
    milestones.forEach((milestone, index) => {
      // Group element
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g")

      // Node levels (column position based on dependencies)
      const level = getLevel(milestone, milestones)
      const nodeX = 50 + level * horizontalSpacing
      const nodeY = 30 + index * verticalSpacing

      // Node rectangle
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("x", `${nodeX}`)
      rect.setAttribute("y", `${nodeY}`)
      rect.setAttribute("width", `${nodeWidth}`)
      rect.setAttribute("height", `${nodeHeight}`)
      rect.setAttribute("rx", "6")
      rect.setAttribute("fill", milestone.completed ? "#d1fae5" : "#fff")
      rect.setAttribute("stroke", milestone.completed ? "#10b981" : "#d1d5db")
      rect.setAttribute("stroke-width", "2")
      g.appendChild(rect)

      // Node text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", `${nodeX + 10}`)
      text.setAttribute("y", `${nodeY + nodeHeight / 2 + 5}`)
      text.setAttribute("fill", "#374151")
      text.textContent = milestone.title.length > 15 ? milestone.title.substring(0, 15) + "..." : milestone.title
      text.style.fontSize = "14px"
      g.appendChild(text)

      // Store position data for arrow drawing
      g.dataset.id = milestone.id
      g.dataset.x = nodeX.toString()
      g.dataset.y = nodeY.toString()
      g.dataset.width = nodeWidth.toString()
      g.dataset.height = nodeHeight.toString()

      svg.appendChild(g)
    })

    // Draw arrows for dependencies
    milestones.forEach((milestone) => {
      if (milestone.dependsOn && milestone.dependsOn.length > 0) {
        milestone.dependsOn.forEach((depId) => {
          // Find source and target elements
          const sourceEl = svg.querySelector(`g[data-id="${depId}"]`)
          const targetEl = svg.querySelector(`g[data-id="${milestone.id}"]`)

          if (sourceEl && targetEl) {
            // Get positions
            const sourceX =
              Number.parseFloat(sourceEl.dataset.x || "0") + Number.parseFloat(sourceEl.dataset.width || "0")
            const sourceY =
              Number.parseFloat(sourceEl.dataset.y || "0") + Number.parseFloat(sourceEl.dataset.height || "0") / 2
            const targetX = Number.parseFloat(targetEl.dataset.x || "0")
            const targetY =
              Number.parseFloat(targetEl.dataset.y || "0") + Number.parseFloat(targetEl.dataset.height || "0") / 2

            // Create arrow
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path")
            const controlPointX = (sourceX + targetX) / 2
            const path = `M ${sourceX} ${sourceY} C ${controlPointX} ${sourceY}, ${controlPointX} ${targetY}, ${targetX} ${targetY}`

            arrow.setAttribute("d", path)
            arrow.setAttribute("fill", "none")
            arrow.setAttribute("stroke", "#94a3b8")
            arrow.setAttribute("stroke-width", "2")
            arrow.setAttribute("marker-end", "url(#arrowhead)")

            // Add arrow before nodes so it appears behind
            svg.insertBefore(arrow, svg.firstChild)
          }
        })
      }
    })

    // Add arrowhead marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker")
    marker.setAttribute("id", "arrowhead")
    marker.setAttribute("markerWidth", "10")
    marker.setAttribute("markerHeight", "7")
    marker.setAttribute("refX", "10")
    marker.setAttribute("refY", "3.5")
    marker.setAttribute("orient", "auto")

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
    polygon.setAttribute("points", "0 0, 10 3.5, 0 7")
    polygon.setAttribute("fill", "#94a3b8")

    marker.appendChild(polygon)
    defs.appendChild(marker)
    svg.appendChild(defs)
  }, [milestones])

  // Helper function to determine node level based on dependencies
  function getLevel(milestone: Milestone, allMilestones: Milestone[]): number {
    if (!milestone.dependsOn || milestone.dependsOn.length === 0) {
      return 0
    }

    let maxLevel = 0
    milestone.dependsOn.forEach((depId) => {
      const dependency = allMilestones.find((m) => m.id === depId)
      if (dependency) {
        const level = getLevel(dependency, allMilestones)
        maxLevel = Math.max(maxLevel, level)
      }
    })

    return maxLevel + 1
  }

  return <div ref={containerRef} className="w-full h-full" />
}

