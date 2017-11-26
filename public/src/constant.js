window.constant = {
  'routes': {
    'buy_ticket': '/users/buy-ticket',
    'verify_pickup_expert': '/users/verify-pickup-expert',
    'load_histories': '/users/load-chat-history',
    'user_chat': '/user-chat',
    'load_notifications': '/users/load-notification',
    'home': '/',
    'expert_detail': '/expert-detail',
    'update_partner': '/users/update-partner'
  },

  'role': {
    'user_role' : 'user',
    'expert_role': 'expert'
  },

  'sent_status': {
    'sending': 'sending',
    'sent': 'sent',
    'seen': 'seen',
    'fail': 'fail'
  },

  'socket_event': {
    'message_from_client': 'message_from_client',
    'notify_received_message': 'notify_received_message',
    'message_from_server': 'message_from_server',
    'update_message_status_from_server': 'update_message_status_from_server',
    'seen_all_messages': 'seen_all_messages',
    'update_all_message_status': 'update_all_message_status',
  },

  'message_type': {
    'text': 1,
    'media': 2
  },

  'message_source': {
    'me': 'me',
    'from_partner': 'from_partner',
    'expert_title': 'expert_title'
  },

  'bus_events': {
    'init_socket': 'init_socket',
    'remove_socket': 'remove_socket'
  },

  'host': 'http://127.0.0.1:3000',

  'upload': {
    'max_file' : 5,
    'max_size_per_file': 5,
    'file_types': ['image/png', 'image/jpeg'],
    'default_url': 'http://127.0.0.1:3000/upload/default.jpg',

  }

};