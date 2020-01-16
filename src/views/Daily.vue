<template>
  <v-container class="fill-height">
    <v-row no-gutters
           class="mb-1">
      <v-col cols="12"
             md="6">
        <v-subheader>I work, try me!</v-subheader>
        <v-menu ref="menu"
                v-if="isMobile"
                v-model="menu"
                transition="scale-transition"
                offset-y
                min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="date"
                          outlined
                          append-icon="mdi-calendar-month"
                          readonly
                          v-on="on" />
          </template>
          <v-date-picker v-model="date"
                         no-title
                         scrollable
                         :max="today"
                         @change="onDateSelected">
            <v-spacer />
            <v-btn text
                   color="primary"
                   @click="menu = false">
              Cancel
            </v-btn>
            <v-btn text
                   color="primary"
                   @click="$refs.menu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-date-picker v-if="!isMobile"
                       v-model="date"
                       :max="today"
                       no-title
                       @change="onDateSelected" />
      </v-col>
      <v-col cols="12"
             md="6"
             v-if="isTodaySelected">
        <v-row no-gutters>
          <v-col cols="12"
                 class="text-xs-left text-md-right">
            <span class="title">
              Current Session -
            </span>
            <span class="title">
              {{ workingInfo.currentSession }}
            </span>
          </v-col>
          <v-col cols="12"
                 class="text-xs-left text-md-right">
            <span class="title">
              Remaining Work Time -
            </span>
            <span class="title">
              {{ workingInfo.remainingTime }}
            </span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-skeleton-loader :loading="loading"
                           type="table">
          <v-data-table :items="activeEntries"
                        :headers="headers"
                        disable-sort
                        hide-default-footer>
            <template v-slot:item.entryType="{ item }">
              <span :class="item.entryType.toLowerCase()">
                {{ item.entryType }}
              </span>
            </template>
            <template v-slot:body.append>
              <tr class="font-weight-bold dark-row"
                  :class="{'v-data-table__mobile-table-row': isMobile}">
                <td :class="{'v-data-table__mobile-row': isMobile}">
                  <div :class="{'v-data-table__mobile-row__header': isMobile}">
                    Total Work Time
                  </div>
                  <div v-if="isMobile"
                       class="v-data-table__mobile-row__cell">
                    {{ activeWorkingInfo.totalWorkTime }}
                  </div>
                </td>
                <td v-if="!isMobile">
                  {{ activeWorkingInfo.totalWorkTime }}
                </td>
              </tr>
              <tr class="font-weight-bold dark-row"
                  :class="{'v-data-table__mobile-table-row': isMobile}">
                <td :class="{'v-data-table__mobile-row': isMobile}">
                  <div :class="{'v-data-table__mobile-row__header': isMobile}">
                    Total Break Time
                  </div>
                  <div v-if="isMobile"
                       class="v-data-table__mobile-row__cell">
                    {{ activeWorkingInfo.totalBreak }}
                  </div>
                </td>
                <td v-if="!isMobile">
                  {{ activeWorkingInfo.totalBreak }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { format } from 'date-fns';

export default {
  name: 'Daily',
  components: {
  },
  data() {
    return {
      activeEntries: [],
      activeWorkingInfo: {},
      loading: false,
      today: format(new Date(), 'yyyy-MM-dd'),
      date: format(new Date(), 'yyyy-MM-dd'),
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
      menu: false,
    };
  },
  computed: {
    ...mapGetters([
      'entries',
      'workingInfo',
      'historyRecord',
    ]),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTodaySelected() {
      return this.today === this.date;
    },
  },
  methods: {
    ...mapActions([
      'getHistoryRecord',
      'getTodayRecord',
    ]),
    onDateSelected() {
      if (this.isTodaySelected) {
        this.loading = true;
        this.getTodayRecord().then(() => {
          this.activeEntries = this.entries;
          this.activeWorkingInfo = this.workingInfo;
          this.loading = false;
        });
        return;
      }

      let dayData = this.historyRecord(this.date);
      if (dayData) {
        this.activeEntries = dayData.entries;
        this.activeWorkingInfo = {
          totalWorkTime: dayData.totalWorkTime,
          totalBreak: dayData.totalBreak,
        };
        return;
      }

      this.loading = true;
      this.getHistoryRecord(this.date).then(() => {
        this.loading = false;
        dayData = this.historyRecord(this.date);
        this.activeEntries = dayData.entries;
        this.activeWorkingInfo = {
          totalWorkTime: dayData.totalWorkTime,
          totalBreak: dayData.totalBreak,
        };
      });
    },
  },
  mounted() {
    this.activeEntries = this.entries;
    this.activeWorkingInfo = this.workingInfo;
  },
};
</script>

<style lang="scss">
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

  .v-data-table__mobile-row {
    background-color: #cfd8dc !important;
  }
}
</style>
