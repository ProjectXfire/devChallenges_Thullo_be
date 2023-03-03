export const Permission = {
  admin: 'admin',
  board: {
    edit: 'board_edit',
    remove: 'board_remove',
    member: {
      assign: 'board_assign_member',
      remove: 'board_remove_member',
    },
  },
  list: {
    create: 'list_create',
    edit: 'list_edit',
    remove: 'list_remove',
  },
  task: {
    create: 'task_create',
    edit: 'task_edit',
    remove: 'task_remove',
    responsable: {
      assign: 'task_assign_responsable',
      remove: 'task_remove_responsable',
    },
    label: {
      create: 'task_create_label',
      remove: 'task_remove_label',
    },
    attachment: {
      create: 'task_create_attachment',
      remove: 'task_remove_attachment',
    },
  },
};
