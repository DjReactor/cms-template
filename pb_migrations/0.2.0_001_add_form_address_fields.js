migrate((db) => {
  const contacts = db.findCollectionByNameOrId("contacts");
  const settings = db.findCollectionByNameOrId("settings");

  // Add fields to contacts
  const contactsSchema = contacts.schema;
  contactsSchema.push({
    "name": "address_street",
    "type": "text",
    "required": false
  });
  contactsSchema.push({
    "name": "address_city",
    "type": "text",
    "required": false
  });
  contactsSchema.push({
    "name": "address_state",
    "type": "text",
    "required": false
  });
  contactsSchema.push({
    "name": "address_zip",
    "type": "text",
    "required": false
  });
  contactsSchema.push({
    "name": "address_full",
    "type": "text",
    "required": false
  });
  contactsSchema.push({
    "name": "notes",
    "type": "text",
    "required": false
  });
  contacts.schema = contactsSchema;
  db.saveCollection(contacts);

  // Add fields to settings
  const settingsSchema = settings.schema;
  settingsSchema.push({
    "name": "lead_webhook_url",
    "type": "text",
    "required": false
  });
  settingsSchema.push({
    "name": "lead_webhook_secret",
    "type": "text",
    "required": false
  });
  settings.schema = settingsSchema;
  db.saveCollection(settings);

}, (db) => {
  // Down migration
  const contacts = db.findCollectionByNameOrId("contacts");
  const settings = db.findCollectionByNameOrId("settings");

  const contactsSchema = contacts.schema;
  contacts.schema = contactsSchema.filter(f => !["address_street", "address_city", "address_state", "address_zip", "address_full", "notes"].includes(f.name));
  db.saveCollection(contacts);

  const settingsSchema = settings.schema;
  settings.schema = settingsSchema.filter(f => !["lead_webhook_url", "lead_webhook_secret"].includes(f.name));
  db.saveCollection(settings);
})