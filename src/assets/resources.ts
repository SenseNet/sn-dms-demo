const resources = {
    EMAIL_IS_NOT_VALID_MESSAGE: 'Please provide a valid e-mail address!',
    PASSWORD_IS_NOT_VALID_MESSAGE: 'Please provide a password!',
    WRONG_USERNAME_OR_PASSWORD: 'Wrong user name or password',
    EMAIL_INPUT_LABEL: 'E-mail',
    PASSWORD_INPUT_LABEL: 'Password',
    EMAIL_INPUT_PLACEHOLDER: 'E-mail',
    PASSWORD_INPUT_PLACEHOLDER: 'Password',
    LOGIN_BUTTON_TEXT: 'Login',
    LOGIN_TAB_TEXT: 'Login',
    REGISTER_TAB_TEXT: 'Register',
    WELCOME_MESSAGE: 'Welcome to the sensenet Document Management System Experiment! We are thrilled to have you here. Please check out our <a href="/#/privacypolicy" target="_blank">privacy policy</a>, then log in, or register!',
    REGISTRATION_BUTTON_TEXT: 'Register',
    EMAIL_INPUT_FORMAT_PLACEHOLDER: 'example@domain.com',
    CONFIRM_PASSWORD_INPUT_LABEL: 'Confirm password',
    PASSWORD_SHOULD_BE_VALID: 'Password needs to contain at least 3 characters!',
    PASSWORDS_SHOULD_MATCH: 'Passwords should match!',
    USER_IS_ALREADY_REGISTERED: 'The email address you have entered is already registered!',
    CAPTCHA_ERROR: 'Please complete the captcha!',
    OPEN_MENU: 'Open menu',
    LOGOUT: 'Logout',
    UPLOAD_BUTTON_TITLE: 'Upload',
    UPLOAD_BUTTON_UPLOAD_FILE_TITLE: 'Upload file',
    UPLOAD_BUTTON_UPLOAD_FOLDER_TITLE: 'Upload folder',
    UPLOAD_BAR_TITLE: 'Uploads',
    UPLOAD_BAR_CLOSE_TITLE: 'Close',
    MYPROFILE: 'My profile',
    SETTINGS: 'Settings',
    ADD_NEW: 'New',
    USER: 'user',
    GROUP: 'group',
    CONTENTTYPE: 'contenttype',
    DOCUMENTS: 'Documents',
    SHARED_WITH_ME: 'Shared with me',
    SAVED_QUERIES: 'Saved queries',
    TRASH: 'Trash',
    USERS: 'Users',
    GROUPS: 'Groups',
    CONTENT_TYPES: 'Content Types',
    CONTENT_TEMPLATES: 'Content Templates',
    CONTENTTEMPLATE: 'Template',
    COMMON: 'Common',
    AD_SYNC: 'AD sync',
    BUILTIN_TYPES: 'Built-in types',
    CUSTOM_TYPES: 'Custom types',
    MY_CUSTOM_TYPES: 'My custom types',
    PREVIEW: 'Preview',
    DELETE: 'Delete',
    ARE_YOU_SURE_YOU_WANT_TO_DELETE: 'Are you sure you want to delete the following(s)?',
    CANCEL: 'Cancel',
    DELETE_PERMANENTLY: 'Delete permanently',
    VERSIONS: 'Versions',
    SHARE: 'Share',
    SHARED_WITH: 'Shared with',
    SHARE_PERMISSION_VIEW: 'View',
    SHARE_PERMISSION_EDIT: 'Edit',
    MORE_SHARE_OPTIONS: 'More sharing options',
    SHARE_LINK_PREFIX: 'Anyone with the link',
    SHARE_LINK_POSTFIX_OFF: 'Only specific people can access',
    SHARE_LINK_POSTFIX_VIEW: 'can view',
    SHARE_LINK_POSTFIX_EDIT: 'can edit',
    SHARE_COPY_LINK: 'Copy link',
    COPY_LINK: 'Copy link',
    SHARE_EMAIL_INPUT_PLACEHOLDER: 'Type an e-mail address',
    OK: 'Ok',
    UPLOAD_NEW_VERSION: 'Upload new version',
    VERSIONING_MODE: 'Versioning mode',
    PATH: 'Path',
    VERSIONING: [
        'None',
        'Inherited',
        'Major only',
        'Major and minor',
    ],
    VERSION: 'Version',
    MODIFIED: 'Modified by',
    COMMENT: 'Comment',
    REJECT_REASON: 'Reject reason',
    VERSION_APPROVED: 'Approved',
    VERSION_LOCKED: 'Locked',
    VERSION_DRAFT: 'Draft',
    VERSION_PENDING: 'Pending',
    VERSION_REJECTED: 'Rejected',
    RESTORE_VERSION: 'Restore version',
    ARE_YOU_SURE_YOU_WANT_TO_RESTORE: 'Are you sure you want to restore version ',
    OF: 'of',
    RESTORE: 'Restore',
    ITEMS_ARE: 'items are',
    ITEMS: 'items',
    CREATE_CONTENT_SUCCESS_MESSAGE: 'is successfully created',
    CREATE_CONTENT_SUCCESS_MULTIPLE_MESSAGE: 'successfully created',
    CREATE_CONTENT_FAILURE_MESSAGE: 'cannot be created',
    DELETE_BATCH_SUCCESS_MULTIPLE_MESSAGE: 'successfully deleted',
    DELETE_BATCH_SUCCESS_MESSAGE: 'is successfully deleted',
    DELETE_BATCH_SUCCESS_FAILED_MESSAGE: 'cannot be deleted',
    MOVE_BATCH_SUCCESS_MULTIPLE_MESSAGE: 'successfully moved',
    COPY_BATCH_SUCCESS_MULTIPLE_MESSAGE: 'successfully copied',
    EDIT_PROPERTIES: 'Edit properties',
    UPDATE_CONTENT_SUCCESS_MESSAGE: 'is successfully updated',
    CHECKOUT_SUCCESS_MESSAGE: '{contentName} is successfully checked-out',
    CHECKOUT_SUCCESS_MULTIPLE_MESSAGE: '{count} items are succesfully checked-out',
    CHECKIN_SUCCESS_MESSAGE: '{contentName} is successfully checked-in',
    CHECKIN_SUCCESS_MULTIPLE_MESSAGE: '{count} items are succesfully checked in',
    PUBLISH_SUCCESS_MESSAGE: '{contentName} is successfully published',
    PUBLISH_SUCCESS_MULTIPLE_MESSAGE: '{count} items are succesfully published',
    UNDOCHECKOUT_SUCCESS_MESSAGE: '{contentName} is reverted to the status before checking out',
    UNDOCHECKOUT_SUCCESS_MULTIPLE_MESSAGE: '{count} items are reverted to the status before checking out',
    FORCEUNDOCHECKOUT_SUCCESS_MESSAGE: '{contentName} is reverted by force to the status before checking out',
    FORCEUNDOCHECKOUT_SUCCESS_MULTIPLE_MESSAGE: '{count} items are reverted by force to the status before checking out',
    REJECT_SUCCESS_MESSAGE: '{contentName} is rejected successfully',
    REJECT_SUCCESS_MULTIPLE_MESSAGE: '{count} items are rejected successfully',
    MOVE_BATCH_SUCCESS_MESSAGE: 'is moved successfully',
    COPY_BATCH_SUCCESS_MESSAGE: 'is copied successfully',
    COPY_BATCH_FAILURE_MESSAGE: 'cannot be copied',
    MOVE_BATCH_FAILURE_MESSAGE: 'cannot be moved',
    APPROVE_OR_REJECT: 'Approve or reject',
    YOU_ARE_ABOUT_TO_APPROVE_OR_REJECT: 'You are about to approve or reject',
    APPROVE: 'Approve',
    REJECT: 'Reject',
    REJECT_REASON_PLACEHOLDER: 'Please provide a reason for rejecting the content',
    APPROVE_SUCCESS_MESSAGE: '{contentName} is successfully approved',
    APPROVE_SUCCESS_MULTIPLE_MESSAGE: '{count} items are successfully approved',
    APPROVE_FAILURE_MESSAGE: '{contentName} cannot be approved',
    CONTENT: 'Content',
    REJECT_FAILURE_MESSAGE: 'cannot be rejected',
    CHECKOUT_FAILURE_MESSAGE: 'cannot be checked-out',
    CHECKIN_FAILURE_MESSAGE: 'cannot be checked-in',
    PUBLISH_FAILURE_MESSAGE: 'cannot be published',
    UNDOCHECKOUT_FAILURE_MESSAGE: 'cannot be checked-in',
    FORCEUNDOCHECKOUT_FAILURE_MESSAGE: 'cannot be checked-in',
    EDIT_PROPERTIES_SUCCESS_MESSAGE: 'The content \'{contentName}\' has been modified',
    EDIT_PROPERTIES_FAILURE_MESSAGE: 'The content \'{contentName}\' cannot be modified',
    CHECKED_OUT_BY: 'Checked out by: ',
    APPROVABLE: 'Content should be approved',
    COPY_HERE: 'Copy content here',
    MOVE_HERE: 'Move content here',
    MOVE: 'Move content',
    ARE_YOU_SURE_YOU_WANT_TO_MOVE: 'You are about to move the following content item(s):',
    TO: 'to',
    COPY: 'Copy content',
    ARE_YOU_SURE_YOU_WANT_TO_COPY: 'You are about to copy the following content item(s):',
    MOVETO_BUTTON: 'Move content here',
    COPYTO_BUTTON: 'Copy content here',
    NEW_FOLDER: 'New folder',
    DELETE_FROM_GROUP: 'Delete from group',
    ADD_TO_GROUP: 'Add to group',
    REMOVE_FROM_SELECTED_GROUPS: 'Remove from selected groups',
    ARE_YOU_SURE_YOU_WANT_TO_REMOVE_USER: 'Are you sure you want to remove user',
    FROM_GROUP: 'from group',
    ADD: 'Add',
}

const resourceHandler: ProxyHandler<typeof resources> = {
    get: (target, name) => {
        return name in target ? target[name] : `!!${name.toString()}!!`
    },
}

const proxy = new Proxy(resources, resourceHandler)

export { proxy as resources }
