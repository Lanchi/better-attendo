<template>
  <v-container class="fill-height">
    <v-card class="card-border mx-auto pa-5"
            width="450"
            max-width="450"
            flat>
      <v-card-text class="pt-6 px-5 pb-0">
        <v-form v-model="formValid"
                @submit.prevent
                ref="loginForm">
          <v-text-field label="Username"
                        class="pb-2"
                        type="text"
                        v-model="user.username"
                        outlined />
          <v-text-field :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        label="Password"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="user.password"
                        outlined
                        @keyup.enter="performLogin"
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
               @click.native="performLogin">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar color="error"
                v-model="snackbar">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data: () => ({
    loading: false,
    user: {},
    showPassword: false,
    formValid: null,
    snackbar: false,
    errorMessage: null,
  }),
  methods: {
    ...mapActions([
      'login',
    ]),
    performLogin() {
      this.loading = true;
      this.login(this.user).then(() => {
        this.$router.push({
          name: 'Daily',
        });
      }).catch(() => {
        this.snackbar = true;
        this.errorMessage = 'We are having troubles logging you in, there are probably some issues with Attendo API.';
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
