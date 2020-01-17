<template>
  <v-app>
    <v-app-bar app
               color="primary"
               dark>
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="2"
                 class="py-xs-1">
            <v-img src="/img/logo.png"
                   width="40"
                   height="40" />
          </v-col>
          <v-spacer />
          <v-col cols="10"
                 class="text-right"
                 align-self="center"
                 v-if="user">
            {{ user.username }}
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'user',
    ]),
  },
};
</script>
