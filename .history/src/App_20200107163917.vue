<template>
  <v-app>
    <v-app-bar app
               color="primary"
               dark />
    <v-content>
      <v-card class="card-border mx-auto pa-5"
              max-width="480"
              flat>
        <v-card-text class="pt-6 px-5 pb-0">
          <v-form v-model="formValid"
                  autocomplete="off"
                  @submit.prevent
                  ref="loginForm">
            <v-text-field label="Username"
                          class="pb-2"
                          type="text"
                          v-model="user.username"
                          outlined />
            <v-text-field :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                          label="Password"
                          :type="showPassword ? 'text' : 'password'"
                          v-model="user.password"
                          outlined
                          @keyup.enter="onLoginClicked"
                          @click:append="showPassword = !showPassword" />
          </v-form>
        </v-card-text>
        <v-card-actions class="px-5 pt-4">
          <v-btn block
                 depressed
                 color="primary"
                 :loading="loading"
                 :disabled="loading"
                 class="text-none dark-button"
                 @click.native="login">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-content>
  </v-app>
</template>

<script>
import api from './api';

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    user: {},
    showPassword: false,
    formValid: null,
  }),
  methods: {
    login() {
      api.login(this.user).then((result) => {
        this.$store.dispatch('saveUser', result);
      });
    },
  },
};
</script>
