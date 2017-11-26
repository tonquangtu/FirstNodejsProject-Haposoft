module.exports = {

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
    'update_all_message_status': 'update_all_message_status',
    'seen_all_messages': 'seen_all_messages'
  },

  'message' : {
    'success': 'Success'
  },

  'error_message' : {
    'not_found_user': 'Not found user in system',
    'not_found_expert': 'Not found expert in system',
    'expert_id_invalid': 'Expert id invalid in system',
    'server_error': 'Server have an error, try again',
    'not_found_history': 'Not found history',
    'error_load_history': 'Error to load history'
  },

  'notification_limit': 10,
  'chat_load_limit': 20,

  'type': {
    'text': 1,
    'media': 2
  },

  'msg_from' : {
    'me': 'me',
    'from_partner': 'from_partner',
    'expert_title': 'expert_title'
  },

  'host': 'http://127.0.0.1:3000'
};


