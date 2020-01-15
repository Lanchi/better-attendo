<template>
  <v-app>
    <v-app-bar app
               color="primary"
               dark />
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
