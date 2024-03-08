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
    },
    filter: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    filteredData() {
      return this.data.filter((item) => {
        for (let key in this.filter) {
          if (item[key] !== this.filter[key]) {
            if (!item[key].toLowerCase().indexOf(this.filter[key]) === -1) {
              return true
            }
            return false
          }
        }
        return true
      })
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
            :colspan="colspans[i] || 1"
            class="header-item"
          >
            {{ `${header !== 'actions' ? header : ''}` }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(entity, entity_index) in filteredData"
          :key="`entity-${entity_index}`"
        >
          <tr class="table-rows">
            <td
              v-for="(header, i) in headers"
              :key="`${header}-${i}`"
              :colspan="colspans[i] || 1"
            >
              <slot
                :name="`column${i}`"
                :entity="{ row_id: entity_index, data: entity }"
              ></slot>
            </td>
          </tr>
          <slot :name="`column-${entity_index}-expanded`"></slot>
        </template>
      </tbody>
    </table>
  </div>
</template>
<style lang="scss">
table {
  border-collapse: collapse;
  border: none;
  width: 100%;
  overflow: auto;
  table-layout: fixed !important;
  word-wrap: break-word;
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.1);

  -webkit-border-top-left-radius: 1rem;
  -moz-border-top-left-radius: 1rem;
  -webkit-border-top-right-radius: 1rem;
  -moz-border-top-right-radius: 1rem;
  background-color: #f0f0f0;

  .header {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 2;
    background-color: #f0f0f0;
    th {
      border-top-right-radius: 1rem;
      border-top-left-radius: 1rem;
    }
  }

  td {
    padding: 1.5rem 0 2rem 3.4rem;
    text-align: start;
  }

  .header-item {
    padding: 2rem 0 2rem 3.4rem;
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
    position: relative;
    &:hover {
      background-color: #fdfdfd;
    }
  }
}
</style>
