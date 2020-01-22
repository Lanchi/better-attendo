<template>
  <v-container class="fill-height">
    <v-row no-gutters
           class="mb-1">
      <v-col cols="12"
             md="6">
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
                          color="primary"
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
                       :first-day-of-week="1"
                       @change="onDateSelected" />
      </v-col>
      <v-col cols="12"
             md="6"
             v-if="isTodaySelected">
        <v-row no-gutters>
          <v-col cols="12">
            <v-card>
              <v-card-text class="pa-0">
                <v-list class="transparent py-0"
                        dense>
                  <v-subheader class="font-weight-bold">
                    Daily
                  </v-subheader>
                  <v-list-item>
                    <v-list-item-title>Current Session</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ workingInfo.currentSession }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Remaining Work Time</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ workingInfo.remainingTime }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Estimated end at</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ workingInfo.estimatedEndTime }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider />
                  <v-subheader class="font-weight-bold">
                    <span class="mr-1">Weekly</span>
                  </v-subheader>
                  <v-list-item>
                    <v-list-item-title>
                      <span class="mr-1">Target</span>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon small
                                  v-on="on"
                                  color="grey lighten-1">
                            mdi-alert-circle-outline
                          </v-icon>
                        </template>
                        <span>Target time from the beginning of the week to today</span>
                      </v-tooltip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ weeklyAggregates.target }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Current</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ weeklyAggregates.current }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>You're still missing</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      {{ weeklyAggregates.difference }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
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
                        :page.sync="page"
                        :items-per-page="15"
                        @page-count="pageCount=$event"
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
        <v-pagination v-model="page"
                      :length="pageCount" />
      </v-col>
    </v-row>
    <v-snackbar color="error"
                v-model="snackbar">
      {{ errorMessage }}
    </v-snackbar>
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
      errorMessage: null,
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
      page: 1,
      pageCount: 0,
      snackbar: false,
    };
  },
  computed: {
    ...mapGetters([
      'entries',
      'workingInfo',
      'historyRecord',
      'weeklyAggregates',
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
    allowedDates(val) {
      // don't allow weekends
      return ![0, 6].includes(new Date(val).getDay());
    },
    onDateSelected() {
      if (this.isTodaySelected) {
        this.loading = true;
        this.getTodayRecord().then(() => {
          this.activeEntries = this.entries;
          this.activeWorkingInfo = this.workingInfo;
          this.loading = false;
          this.page = 1;
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
        this.page = 1;
        return;
      }

      this.loading = true;
      this.getHistoryRecord(this.date).then(() => {
        this.loading = false;
        this.page = 1;
        dayData = this.historyRecord(this.date);
        this.activeEntries = dayData.entries;
        this.activeWorkingInfo = {
          totalWorkTime: dayData.totalWorkTime,
          totalBreak: dayData.totalBreak,
        };
      }).catch(() => {
        this.snackbar = true;
        this.errorMessage = 'Something went wrong, please try again';
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
.v-picker--date {
  height: 100%;
}

.v-data-table-header {
  background-color: #71BEAE !important;
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
