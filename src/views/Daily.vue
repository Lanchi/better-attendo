<template>
  <v-container fill-height>
    <v-row no-gutters
           class="mb-1">
      <v-col cols="12" md="6">
        <v-date-picker no-title />
      </v-col>
      <v-col cols="12" md="6">
        <v-row no-gutters>
          <v-col cols="12"
                 class="text-right">
            <span class="title">Current Session - </span>
            <span class="title">{{ workingInfo.currentSession }}</span>
          </v-col>
          <v-col cols="12"
                 class="text-right">
            <span class="title">Remaining Work Time - </span>
            <span class="title">{{ workingInfo.remainingTime }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-data-table :items="entries"
                      :headers="headers"
                      hide-default-footer>
          <template v-slot:item.entryType="{ item }">
            <span :class="item.entryType.toLowerCase()">
              {{ item.entryType }}
            </span>
          </template>
          <template v-slot:body.append>
            <tr class="font-weight-bold dark-row">
              <td>Total Work Time</td>
              <td>{{ workingInfo.totalWorkTime}}</td>
            </tr>
            <tr class="font-weight-bold dark-row">
              <td>Total Break Time</td>
              <td>{{ workingInfo.totalBreak}}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row no-gutters>

    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Daily',
  components: {
  },
  data() {
    return {
      deadline: '',
      headers: [
        {
          text: 'Time',
          value: 'timestamp',
        },
        {
          text: 'Type',
          value: 'entryType',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'entries',
      'workingInfo',
    ]),
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.v-data-table {
  width: 100%;
}

.v-data-table-header {
  background-color: #1976d2 !important;
  th {
    color: white !important;
    font-size: 14px;
  }
}

.check_in {
  color: green;
}

.check_out {
  color: red;
}

.dark-row {
  background-color: #cfd8dc !important;
}
</style>