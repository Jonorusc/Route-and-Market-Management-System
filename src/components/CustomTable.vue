<script>
import { computed } from 'vue'

export default {
  name: 'CustomTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    colspans: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr class="header">
          <th
            v-for="(header, i) in headers"
            :key="`${header}${i}`"
            class="header-item"
          >
            {{ `${header !== 'actions' ? header : ''}` }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entity in data"
          :key="`entity-${entity.name}`"
          :colspan="colspans[i] || 1"
          class="table-rows"
        >
          <td v-for="(header, i) in headers" :key="`${header}-${i}`">
            <slot :name="`column${i}`" :entity="entity"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss">
table {
  border-collapse: collapse;
  width: 100%;
  table-layout: auto !important;
  word-wrap: break-word;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1);
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background-color: #f0f0f0;
  user-select: none;

  tr:first-child td:first-child {
    border-top-left-radius: 0.5rem;
  }
  tr:first-child td:last-child {
    border-top-right-radius: 0.5rem;
  }

  td {
    padding: 1.5rem 3.4rem;
    text-align: start;
  }

  .header-item {
    padding: 2rem 3.4rem;
    font-size: 1.6rem;
    text-transform: capitalize;
    text-align: start;
    color: #b6b6b6;
  }

  .table-rows {
    background-color: white;
    border-bottom: 0.1rem solid #f0f0f0;
    color: #414141;
    font-weight: 600;
    &:hover {
      outline: solid 0.5px #b6b6b6;
      outline-offset: -0.5px;
      border-color: #b6b6b6;
      box-shadow:
        0 0 0 0.5px #b6b6b6,
        inset 0 0 0 0.5px #b6b6b6;
    }
  }
}
</style>
