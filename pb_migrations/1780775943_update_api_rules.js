/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collectionNames = [
    "business_info", "services", "service_areas", "testimonials", "faqs", 
    "pricing_plans", "blog_categories", "blog_posts", "site_content", 
    "seo_settings", "call_logs", "crm_contacts", "crm_notes"
  ];
  
  for (const name of collectionNames) {
    try {
      const collection = app.findCollectionByNameOrId(name);
      collection.createRule = "@request.auth.id != ''";
      collection.updateRule = "@request.auth.id != ''";
      collection.deleteRule = "@request.auth.id != ''";
      app.save(collection);
    } catch (e) {
      console.error("Error updating rules for " + name + ":", e);
    }
  }
}, (app) => {
  const collectionNames = [
    "business_info", "services", "service_areas", "testimonials", "faqs", 
    "pricing_plans", "blog_categories", "blog_posts", "site_content", 
    "seo_settings", "call_logs", "crm_contacts", "crm_notes"
  ];
  
  for (const name of collectionNames) {
    try {
      const collection = app.findCollectionByNameOrId(name);
      collection.createRule = null;
      collection.updateRule = null;
      collection.deleteRule = null;
      app.save(collection);
    } catch (e) {}
  }
});
