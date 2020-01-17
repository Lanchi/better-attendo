<template>
  <v-app>
    <v-app-bar app
               color="primary"
               dark>
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="2">
            <v-img src="/img/logo.png" />
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

export default {
  name: 'App',
};
</script>
