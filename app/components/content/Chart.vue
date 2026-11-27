<script setup lang="ts">
// ::chart
// ---
// type: bar            # or line
// title: …             # what the chart shows
// summary: …           # the one-sentence takeaway (read first by screen readers)
// unit: "%"
// labels: [2019, 2020, 2021]
// series:
//   - name: Brasil
//     values: [10, 12, 15]
// source: Inep (2024)
// ---
// ::
// Rendered as SVG at build time (no chart library, works without JavaScript). Series differ by
// pattern and line style, never by colour alone, and the same numbers are always available as a table.
type Series = { name: string, values: number[] }
const props = withDefaults(defineProps<{
  type?: 'bar' | 'line'
  title: string
  summary: string
  unit?: string
  labels: (string | number)[]
  series: Series[]
  source?: string
}>(), { type: 'bar', unit: '', source: undefined })

assertAccessible(`Chart "${props.title}"`, {
  'title': props.title,
  'summary (the key takeaway)': props.summary,
  'labels': props.labels?.length,
  'series': props.series?.length,
  'one value per label in every series': props.series?.every(s => s.values.length === props.labels.length),
})

const { t, locale } = useI18n()
const id = useId()
const number = new Intl.NumberFormat(locale.value, { maximumFractionDigits: 2 })
const withUnit = (value: number) => `${number.format(value)}${props.unit}`

// Geometry, in SVG user units.
const width = 640
const height = 360
const margin = { top: 16, right: props.type === 'line' ? 128 : 16, bottom: 40, left: 64 }
const plotWidth = width - margin.left - margin.right
const plotHeight = height - margin.top - margin.bottom

// A "nice" axis (steps of 1, 2 or 5 × 10ⁿ) from zero, or from below zero when there are negatives.
const values = props.series.flatMap(s => s.values)
const rawStep = (Math.max(...values, 0) - Math.min(...values, 0)) / 5 || 1
const magnitude = 10 ** Math.floor(Math.log10(rawStep))
const step = ([1, 2, 5, 10].find(n => n * magnitude >= rawStep) ?? 10) * magnitude
const yMin = Math.floor(Math.min(...values, 0) / step) * step
const yMax = Math.ceil(Math.max(...values, 0) / step) * step || step
const ticks = Array.from({ length: Math.round((yMax - yMin) / step) + 1 }, (_, i) => yMin + i * step)
const y = (value: number) => margin.top + ((yMax - value) / (yMax - yMin)) * plotHeight

const band = plotWidth / props.labels.length
const barWidth = (band * 0.8) / props.series.length
const barX = (label: number, serie: number) => margin.left + label * band + band * 0.1 + serie * barWidth
const pointX = (label: number) => margin.left + band * (label + 0.5)
const linePoints = (s: Series) => s.values.map((v, i) => `${pointX(i)},${y(v)}`).join(' ')
const dashes = ['', '8 4', '2 4', '12 4 2 4']

const csv = computed(() => {
  const escape = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`
  const rows = [['', ...props.series.map(s => s.name)], ...props.labels.map((label, i) => [label, ...props.series.map(s => s.values[i]!)])]
  return `data:text/csv;charset=utf-8,${encodeURIComponent(rows.map(row => row.map(escape).join(',')).join('\n'))}`
})
</script>

<template>
  <figure class="chart">
    <figcaption>
      <p :id="`${id}-title`">
        <strong>{{ title }}</strong>
      </p>
      <p :id="`${id}-summary`">
        {{ summary }}
      </p>
      <p v-if="source">
        {{ t('media.source') }}: {{ source }}
      </p>
    </figcaption>

    <ul
      v-if="type === 'bar' && series.length > 1"
      class="link-list"
      aria-hidden="true"
    >
      <li
        v-for="(s, j) in series"
        :key="s.name"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
        ><rect
          width="15"
          height="15"
          x="0.5"
          y="0.5"
          :fill="`url(#${id}-pattern-${j % 4})`"
          stroke="currentColor"
        /></svg>
        {{ s.name }}
      </li>
    </ul>

    <svg
      role="img"
      :aria-labelledby="`${id}-title ${id}-summary`"
      :viewBox="`0 0 ${width} ${height}`"
      font-size="14"
      fill="currentColor"
    >
      <defs>
        <pattern
          v-for="j in 4"
          :id="`${id}-pattern-${j - 1}`"
          :key="j"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          :patternTransform="j === 3 ? '' : 'rotate(45)'"
        >
          <rect
            v-if="j === 1"
            width="8"
            height="8"
            fill="currentColor"
          />
          <line
            v-if="j === 2 || j === 4"
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="currentColor"
            stroke-width="3"
          />
          <circle
            v-if="j === 3"
            cx="4"
            cy="4"
            r="2"
          />
          <line
            v-if="j === 4"
            x1="0"
            y1="4"
            x2="8"
            y2="4"
            stroke="currentColor"
            stroke-width="2"
          />
        </pattern>
      </defs>

      <g
        v-for="tick in ticks"
        :key="tick"
      >
        <line
          :x1="margin.left"
          :x2="width - margin.right"
          :y1="y(tick)"
          :y2="y(tick)"
          stroke="currentColor"
          :stroke-opacity="tick === 0 ? 1 : 0.25"
        />
        <text
          :x="margin.left - 8"
          :y="y(tick)"
          text-anchor="end"
          dominant-baseline="middle"
        >{{ withUnit(tick) }}</text>
      </g>
      <text
        v-for="(label, i) in labels"
        :key="label"
        :x="pointX(i)"
        :y="height - margin.bottom + 24"
        text-anchor="middle"
      >{{ label }}</text>

      <template v-if="type === 'bar'">
        <template
          v-for="(s, j) in series"
          :key="s.name"
        >
          <rect
            v-for="(value, i) in s.values"
            :key="i"
            :x="barX(i, j)"
            :y="Math.min(y(value), y(0))"
            :width="barWidth - 2"
            :height="Math.abs(y(0) - y(value))"
            :fill="`url(#${id}-pattern-${j % 4})`"
            stroke="currentColor"
          />
        </template>
      </template>
      <template v-else>
        <g
          v-for="(s, j) in series"
          :key="s.name"
        >
          <polyline
            :points="linePoints(s)"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            :stroke-dasharray="dashes[j % 4]"
          />
          <circle
            v-for="(value, i) in s.values"
            :key="i"
            :cx="pointX(i)"
            :cy="y(value)"
            r="4"
            :fill="j % 2 ? 'Canvas' : 'currentColor'"
            stroke="currentColor"
            stroke-width="2"
          />
          <!-- Direct label at the end of each line instead of a colour legend. -->
          <text
            :x="pointX(s.values.length - 1) + 10"
            :y="y(s.values.at(-1)!)"
            dominant-baseline="middle"
          >{{ s.name }}</text>
        </g>
      </template>
    </svg>

    <details>
      <summary>{{ t('media.viewData') }}</summary>
      <section
        class="table-scroll"
        :aria-labelledby="`${id}-title`"
        tabindex="0"
      >
        <table>
          <caption>{{ title }}{{ unit ? ` (${unit})` : '' }}</caption>
          <thead>
            <tr>
              <td />
              <th
                v-for="s in series"
                :key="s.name"
                scope="col"
              >
                {{ s.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(label, i) in labels"
              :key="label"
            >
              <th scope="row">
                {{ label }}
              </th>
              <td
                v-for="s in series"
                :key="s.name"
              >
                {{ withUnit(s.values[i]!) }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <p>
        <a
          :href="csv"
          :download="`${slugify(title)}.csv`"
        >{{ t('media.downloadCsv') }}</a>
      </p>
    </details>
  </figure>
</template>
