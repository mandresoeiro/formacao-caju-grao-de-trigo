/*
  Formação CAJU - Grão de Trigo — configuração simples
  -----------------------------------
  1) Cole abaixo a URL e a Publishable/Anon Key do seu projeto Supabase.
  2) Cole o link de UMA playlist católica do Spotify.

  IMPORTANTE:
  - A Publishable/Anon Key pode ficar no front-end quando o banco usa RLS corretamente.
  - NUNCA coloque a service_role key neste arquivo.
*/
window.CAJU_CONFIG = {
  supabaseUrl: '',
  supabasePublishableKey: '',

  firebaseConfig: {
    apiKey: 'AIzaSyBN48F8N1nLf7W-9F0WzIzzVMo-S9QRiGA',
    authDomain: 'formacao-caju-grao-de-trigo.firebaseapp.com',
    projectId: 'formacao-caju-grao-de-trigo',
    storageBucket: 'formacao-caju-grao-de-trigo.firebasestorage.app',
    messagingSenderId: '595376538636',
    appId: '1:595376538636:web:4b0af4151d1630e72e9a29'
  },

  // Exemplo: https://open.spotify.com/playlist/37i9dQZF1DX...
  spotifyPlaylistUrl: 'https://open.spotify.com/playlist/697lHAYF3OBtsB1YFp93Jv',
  spotifyTitle: 'Playlist Católica',
  spotifySubtitle: 'Música para rezar, estudar e permanecer em Deus durante a formação.',

  // Preencha quando quiser ativar contato direto.
  // Exemplos:
  // contactEmail: 'formacao@exemplo.com'
  // whatsappUrl: 'https://wa.me/5585999999999'
  // calendarUrl: 'https://calendly.com/seu-link/reuniao'
  contactEmail: '',
  whatsappUrl: '',
  calendarUrl: '',

  nextMeetingTitle: 'Próximo encontro da formação',
  nextMeetingInfo: 'Data e horário a confirmar pela coordenação.',
  nextMeetingLocation: 'Local a confirmar.',

  creditName: 'SoeiroTech',
  creditUrl: 'https://soeirotech.com.br',

  allowSignUp: true,
  siteName: 'Formação CAJU - Grão de Trigo'
};
