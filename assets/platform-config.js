// Public settings for the GAME project. Keep service_role/payment secrets in Edge Functions.
// The mechanics tracker uses a separate project and is never used by this adapter.
window.MUSHROOMS_PLATFORM_CONFIG = {
  supabaseUrl: '',
  publishableKey: '',
  webPaymentsEnabled: false,
  sdkPath: 'assets/other/js/supabase-2.117.3.min.js'
};
