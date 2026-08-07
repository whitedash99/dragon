--
-- PostgreSQL database dump
--

\restrict TMPnXXTPBOLFx4jkVGrwXUFbbMLtgNUyDEK24sHmsVDU1PD3K9u5aoafe8nG1P5

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."WorkflowTrigger" DROP CONSTRAINT IF EXISTS "WorkflowTrigger_workflowId_fkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowExecution" DROP CONSTRAINT IF EXISTS "WorkflowExecution_workflowId_fkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowCondition" DROP CONSTRAINT IF EXISTS "WorkflowCondition_workflowId_fkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowAction" DROP CONSTRAINT IF EXISTS "WorkflowAction_workflowId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_customerId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketMessage" DROP CONSTRAINT IF EXISTS "TicketMessage_contact_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketMessage" DROP CONSTRAINT IF EXISTS "TicketMessage_admin_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketAttachment" DROP CONSTRAINT IF EXISTS "TicketAttachment_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."TicketActivity" DROP CONSTRAINT IF EXISTS "TicketActivity_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."TeamMember" DROP CONSTRAINT IF EXISTS "TeamMember_departmentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."SEOData" DROP CONSTRAINT IF EXISTS "SEOData_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."Permission" DROP CONSTRAINT IF EXISTS "Permission_roleId_fkey";
ALTER TABLE IF EXISTS ONLY public."PatchNote" DROP CONSTRAINT IF EXISTS "PatchNote_gameId_fkey";
ALTER TABLE IF EXISTS ONLY public."PageSection" DROP CONSTRAINT IF EXISTS "PageSection_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaUsage" DROP CONSTRAINT IF EXISTS "MediaUsage_assetId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaTag" DROP CONSTRAINT IF EXISTS "MediaTag_assetId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaAsset" DROP CONSTRAINT IF EXISTS "MediaAsset_uploaderId_fkey";
ALTER TABLE IF EXISTS ONLY public."MediaAsset" DROP CONSTRAINT IF EXISTS "MediaAsset_folderId_fkey";
ALTER TABLE IF EXISTS ONLY public."InternalNote" DROP CONSTRAINT IF EXISTS "InternalNote_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."GamePlatform" DROP CONSTRAINT IF EXISTS "GamePlatform_gameId_fkey";
ALTER TABLE IF EXISTS ONLY public."GameMedia" DROP CONSTRAINT IF EXISTS "GameMedia_gameId_fkey";
ALTER TABLE IF EXISTS ONLY public."GameFeature" DROP CONSTRAINT IF EXISTS "GameFeature_gameId_fkey";
ALTER TABLE IF EXISTS ONLY public."EmailLog" DROP CONSTRAINT IF EXISTS "EmailLog_ticketId_fkey";
ALTER TABLE IF EXISTS ONLY public."DLC" DROP CONSTRAINT IF EXISTS "DLC_gameId_fkey";
ALTER TABLE IF EXISTS ONLY public."CustomerSession" DROP CONSTRAINT IF EXISTS "CustomerSession_profileId_fkey";
ALTER TABLE IF EXISTS ONLY public."CustomerPreference" DROP CONSTRAINT IF EXISTS "CustomerPreference_profileId_fkey";
ALTER TABLE IF EXISTS ONLY public."CustomerNotification" DROP CONSTRAINT IF EXISTS "CustomerNotification_profileId_fkey";
ALTER TABLE IF EXISTS ONLY public."ContentRevision" DROP CONSTRAINT IF EXISTS "ContentRevision_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public."ContentBlock" DROP CONSTRAINT IF EXISTS "ContentBlock_sectionId_fkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIMessage" DROP CONSTRAINT IF EXISTS "AIMessage_conversationId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIHelpMessage" DROP CONSTRAINT IF EXISTS "AIHelpMessage_conversationId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIFeedback" DROP CONSTRAINT IF EXISTS "AIFeedback_conversationId_fkey";
ALTER TABLE IF EXISTS ONLY public."AIAnalysis" DROP CONSTRAINT IF EXISTS "AIAnalysis_ticketId_fkey";
DROP INDEX IF EXISTS public."Workflow_status_idx";
DROP INDEX IF EXISTS public."Workflow_category_idx";
DROP INDEX IF EXISTS public."WorkflowTrigger_workflowId_idx";
DROP INDEX IF EXISTS public."WorkflowExecution_workflowId_idx";
DROP INDEX IF EXISTS public."WorkflowExecution_status_idx";
DROP INDEX IF EXISTS public."WorkflowCondition_workflowId_idx";
DROP INDEX IF EXISTS public."WorkflowAction_workflowId_idx";
DROP INDEX IF EXISTS public."Webhook_url_key";
DROP INDEX IF EXISTS public."WebhookEvent_event_idx";
DROP INDEX IF EXISTS public."Visitor_ipAddress_key";
DROP INDEX IF EXISTS public."VerificationToken_token_key";
DROP INDEX IF EXISTS public."VerificationToken_identifier_token_key";
DROP INDEX IF EXISTS public."User_role_idx";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."User_email_idx";
DROP INDEX IF EXISTS public."Ticket_ticketId_key";
DROP INDEX IF EXISTS public."Ticket_ticketId_idx";
DROP INDEX IF EXISTS public."Ticket_tenantId_idx";
DROP INDEX IF EXISTS public."Ticket_status_idx";
DROP INDEX IF EXISTS public."Ticket_source_idx";
DROP INDEX IF EXISTS public."Ticket_priority_idx";
DROP INDEX IF EXISTS public."Ticket_legacyContactTicketId_idx";
DROP INDEX IF EXISTS public."Ticket_customerEmail_idx";
DROP INDEX IF EXISTS public."Ticket_createdByType_idx";
DROP INDEX IF EXISTS public."Ticket_category_idx";
DROP INDEX IF EXISTS public."TicketMessage_ticketId_idx";
DROP INDEX IF EXISTS public."TicketAttachment_ticketId_idx";
DROP INDEX IF EXISTS public."TicketActivity_ticketId_idx";
DROP INDEX IF EXISTS public."TestResult_status_idx";
DROP INDEX IF EXISTS public."TestResult_category_idx";
DROP INDEX IF EXISTS public."TeamMember_email_key";
DROP INDEX IF EXISTS public."TeamMember_departmentId_idx";
DROP INDEX IF EXISTS public."SystemSetting_key_key";
DROP INDEX IF EXISTS public."SystemSetting_key_idx";
DROP INDEX IF EXISTS public."SystemSetting_category_idx";
DROP INDEX IF EXISTS public."SystemLog_level_idx";
DROP INDEX IF EXISTS public."SystemHealthCheck_endpoint_key";
DROP INDEX IF EXISTS public."Session_userId_idx";
DROP INDEX IF EXISTS public."Session_sessionToken_key";
DROP INDEX IF EXISTS public."Session_sessionToken_idx";
DROP INDEX IF EXISTS public."SecurityEvent_severity_idx";
DROP INDEX IF EXISTS public."SecurityEvent_eventType_idx";
DROP INDEX IF EXISTS public."SecurityAlert_status_idx";
DROP INDEX IF EXISTS public."ScheduledJob_name_key";
DROP INDEX IF EXISTS public."SEOData_pageId_key";
DROP INDEX IF EXISTS public."Role_name_key";
DROP INDEX IF EXISTS public."Promotion_code_key";
DROP INDEX IF EXISTS public."ProductionEnvironment_name_key";
DROP INDEX IF EXISTS public."PressRelease_slug_key";
DROP INDEX IF EXISTS public."Permission_roleId_idx";
DROP INDEX IF EXISTS public."PerformanceMetric_name_idx";
DROP INDEX IF EXISTS public."PatchNote_gameId_idx";
DROP INDEX IF EXISTS public."Page_status_idx";
DROP INDEX IF EXISTS public."Page_slug_key";
DROP INDEX IF EXISTS public."Page_slug_idx";
DROP INDEX IF EXISTS public."PageSection_pageId_idx";
DROP INDEX IF EXISTS public."Notification_recipient_idx";
DROP INDEX IF EXISTS public."Notification_isRead_idx";
DROP INDEX IF EXISTS public."NotificationTemplate_name_key";
DROP INDEX IF EXISTS public."NotificationPreference_userEmail_key";
DROP INDEX IF EXISTS public."NewsletterSubscriber_email_key";
DROP INDEX IF EXISTS public."NewsletterSubscriber_email_idx";
DROP INDEX IF EXISTS public."NewsArticle_status_idx";
DROP INDEX IF EXISTS public."NewsArticle_slug_key";
DROP INDEX IF EXISTS public."NewsArticle_slug_idx";
DROP INDEX IF EXISTS public."NavigationMenu_name_key";
DROP INDEX IF EXISTS public."Metric_name_key";
DROP INDEX IF EXISTS public."MediaUsage_assetId_idx";
DROP INDEX IF EXISTS public."MediaTag_assetId_idx";
DROP INDEX IF EXISTS public."MediaFolder_slug_key";
DROP INDEX IF EXISTS public."MediaFolder_name_key";
DROP INDEX IF EXISTS public."MediaCollection_name_key";
DROP INDEX IF EXISTS public."MediaAsset_name_idx";
DROP INDEX IF EXISTS public."MediaAsset_folderId_idx";
DROP INDEX IF EXISTS public."MediaAsset_category_idx";
DROP INDEX IF EXISTS public."MarketingTemplate_name_key";
DROP INDEX IF EXISTS public."KnowledgeCategory_name_key";
DROP INDEX IF EXISTS public."KnowledgeArticle_status_idx";
DROP INDEX IF EXISTS public."KnowledgeArticle_slug_key";
DROP INDEX IF EXISTS public."KnowledgeArticle_slug_idx";
DROP INDEX IF EXISTS public."KnowledgeArticle_category_idx";
DROP INDEX IF EXISTS public."InternalNote_ticketId_idx";
DROP INDEX IF EXISTS public."Integration_provider_idx";
DROP INDEX IF EXISTS public."Integration_name_key";
DROP INDEX IF EXISTS public."HealthCheck_service_key";
DROP INDEX IF EXISTS public."Game_status_idx";
DROP INDEX IF EXISTS public."Game_slug_key";
DROP INDEX IF EXISTS public."Game_slug_idx";
DROP INDEX IF EXISTS public."GamePlatform_gameId_idx";
DROP INDEX IF EXISTS public."GameMedia_gameId_idx";
DROP INDEX IF EXISTS public."GameFeature_gameId_idx";
DROP INDEX IF EXISTS public."GameContent_status_idx";
DROP INDEX IF EXISTS public."GameContent_slug_key";
DROP INDEX IF EXISTS public."GameContent_slug_idx";
DROP INDEX IF EXISTS public."FeatureFlag_key_key";
DROP INDEX IF EXISTS public."FeatureFlag_key_idx";
DROP INDEX IF EXISTS public."ErrorLog_source_idx";
DROP INDEX IF EXISTS public."ErrorLog_createdAt_idx";
DROP INDEX IF EXISTS public."EmailLog_recipient_idx";
DROP INDEX IF EXISTS public."Department_name_key";
DROP INDEX IF EXISTS public."DeliveryLog_recipient_idx";
DROP INDEX IF EXISTS public."DLC_gameId_idx";
DROP INDEX IF EXISTS public."Customer_email_key";
DROP INDEX IF EXISTS public."Customer_email_idx";
DROP INDEX IF EXISTS public."CustomerSession_sessionToken_key";
DROP INDEX IF EXISTS public."CustomerSession_profileId_idx";
DROP INDEX IF EXISTS public."CustomerProfile_email_key";
DROP INDEX IF EXISTS public."CustomerProfile_email_idx";
DROP INDEX IF EXISTS public."CustomerPreference_profileId_key";
DROP INDEX IF EXISTS public."CustomerNotification_profileId_idx";
DROP INDEX IF EXISTS public."ContentRevision_pageId_idx";
DROP INDEX IF EXISTS public."ContentRevision_blockKey_idx";
DROP INDEX IF EXISTS public."ContentBlock_key_key";
DROP INDEX IF EXISTS public."ContentBlock_key_idx";
DROP INDEX IF EXISTS public."ContentBlock_category_idx";
DROP INDEX IF EXISTS public."ContactVerificationToken_token_key";
DROP INDEX IF EXISTS public."ContactVerificationToken_token_idx";
DROP INDEX IF EXISTS public."ContactVerificationToken_email_idx";
DROP INDEX IF EXISTS public."ContactTicket_trackingToken_idx";
DROP INDEX IF EXISTS public."ContactTicket_ticketId_key";
DROP INDEX IF EXISTS public."ContactTicket_status_idx";
DROP INDEX IF EXISTS public."ContactTicket_email_idx";
DROP INDEX IF EXISTS public."ContactTicket_createdAt_idx";
DROP INDEX IF EXISTS public."ContactTicket_category_idx";
DROP INDEX IF EXISTS public."CommunityEvent_slug_key";
DROP INDEX IF EXISTS public."Career_status_idx";
DROP INDEX IF EXISTS public."Career_department_idx";
DROP INDEX IF EXISTS public."Campaign_type_idx";
DROP INDEX IF EXISTS public."Campaign_status_idx";
DROP INDEX IF EXISTS public."Campaign_name_key";
DROP INDEX IF EXISTS public."CampaignAnalyticsRecord_campaignId_idx";
DROP INDEX IF EXISTS public."CacheRecord_key_key";
DROP INDEX IF EXISTS public."AutomationLog_workflow_idx";
DROP INDEX IF EXISTS public."AuditLog_userEmail_idx";
DROP INDEX IF EXISTS public."AuditLog_createdAt_idx";
DROP INDEX IF EXISTS public."AuditLog_action_idx";
DROP INDEX IF EXISTS public."AudienceSegment_name_key";
DROP INDEX IF EXISTS public."Article_slug_key";
DROP INDEX IF EXISTS public."Article_slug_idx";
DROP INDEX IF EXISTS public."Article_featured_idx";
DROP INDEX IF EXISTS public."AnalyticsSession_sessionKey_key";
DROP INDEX IF EXISTS public."AnalyticsEvent_event_idx";
DROP INDEX IF EXISTS public."AnalyticsEvent_createdAt_idx";
DROP INDEX IF EXISTS public."Account_userId_idx";
DROP INDEX IF EXISTS public."Account_provider_providerAccountId_key";
DROP INDEX IF EXISTS public."APIUsageRecord_appName_idx";
DROP INDEX IF EXISTS public."APILog_statusCode_idx";
DROP INDEX IF EXISTS public."APILog_endpoint_idx";
DROP INDEX IF EXISTS public."APIKey_name_idx";
DROP INDEX IF EXISTS public."APIEndpoint_url_key";
DROP INDEX IF EXISTS public."APIApplication_name_key";
DROP INDEX IF EXISTS public."AIUsage_feature_idx";
DROP INDEX IF EXISTS public."AIUsage_createdAt_idx";
DROP INDEX IF EXISTS public."AISetting_key_key";
DROP INDEX IF EXISTS public."AISearchLog_query_idx";
DROP INDEX IF EXISTS public."AIPrompt_key_key";
DROP INDEX IF EXISTS public."AIPrompt_key_idx";
DROP INDEX IF EXISTS public."AIPrompt_category_idx";
DROP INDEX IF EXISTS public."AIMessage_conversationId_idx";
DROP INDEX IF EXISTS public."AIKnowledge_topic_key";
DROP INDEX IF EXISTS public."AIKnowledge_category_idx";
DROP INDEX IF EXISTS public."AIHelpMessage_conversationId_idx";
DROP INDEX IF EXISTS public."AIHelpConversation_customerEmail_idx";
DROP INDEX IF EXISTS public."AIFeedback_conversationId_idx";
DROP INDEX IF EXISTS public."AIConversation_userEmail_idx";
DROP INDEX IF EXISTS public."AIAnalysis_ticketId_idx";
ALTER TABLE IF EXISTS ONLY public."Workflow" DROP CONSTRAINT IF EXISTS "Workflow_pkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowTrigger" DROP CONSTRAINT IF EXISTS "WorkflowTrigger_pkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowExecution" DROP CONSTRAINT IF EXISTS "WorkflowExecution_pkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowCondition" DROP CONSTRAINT IF EXISTS "WorkflowCondition_pkey";
ALTER TABLE IF EXISTS ONLY public."WorkflowAction" DROP CONSTRAINT IF EXISTS "WorkflowAction_pkey";
ALTER TABLE IF EXISTS ONLY public."Webhook" DROP CONSTRAINT IF EXISTS "Webhook_pkey";
ALTER TABLE IF EXISTS ONLY public."WebhookEvent" DROP CONSTRAINT IF EXISTS "WebhookEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."Visitor" DROP CONSTRAINT IF EXISTS "Visitor_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."UploadHistory" DROP CONSTRAINT IF EXISTS "UploadHistory_pkey";
ALTER TABLE IF EXISTS ONLY public."Ticket" DROP CONSTRAINT IF EXISTS "Ticket_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketMessage" DROP CONSTRAINT IF EXISTS "TicketMessage_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketAttachment" DROP CONSTRAINT IF EXISTS "TicketAttachment_pkey";
ALTER TABLE IF EXISTS ONLY public."TicketActivity" DROP CONSTRAINT IF EXISTS "TicketActivity_pkey";
ALTER TABLE IF EXISTS ONLY public."TestResult" DROP CONSTRAINT IF EXISTS "TestResult_pkey";
ALTER TABLE IF EXISTS ONLY public."TeamMember" DROP CONSTRAINT IF EXISTS "TeamMember_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemSetting" DROP CONSTRAINT IF EXISTS "SystemSetting_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemResource" DROP CONSTRAINT IF EXISTS "SystemResource_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemLog" DROP CONSTRAINT IF EXISTS "SystemLog_pkey";
ALTER TABLE IF EXISTS ONLY public."SystemHealthCheck" DROP CONSTRAINT IF EXISTS "SystemHealthCheck_pkey";
ALTER TABLE IF EXISTS ONLY public."StorageConfiguration" DROP CONSTRAINT IF EXISTS "StorageConfiguration_pkey";
ALTER TABLE IF EXISTS ONLY public."Session" DROP CONSTRAINT IF EXISTS "Session_pkey";
ALTER TABLE IF EXISTS ONLY public."SecurityEvent" DROP CONSTRAINT IF EXISTS "SecurityEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."SecurityAlert" DROP CONSTRAINT IF EXISTS "SecurityAlert_pkey";
ALTER TABLE IF EXISTS ONLY public."ScheduledJob" DROP CONSTRAINT IF EXISTS "ScheduledJob_pkey";
ALTER TABLE IF EXISTS ONLY public."SEOData" DROP CONSTRAINT IF EXISTS "SEOData_pkey";
ALTER TABLE IF EXISTS ONLY public."Role" DROP CONSTRAINT IF EXISTS "Role_pkey";
ALTER TABLE IF EXISTS ONLY public."Promotion" DROP CONSTRAINT IF EXISTS "Promotion_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductionEnvironment" DROP CONSTRAINT IF EXISTS "ProductionEnvironment_pkey";
ALTER TABLE IF EXISTS ONLY public."PressRelease" DROP CONSTRAINT IF EXISTS "PressRelease_pkey";
ALTER TABLE IF EXISTS ONLY public."Permission" DROP CONSTRAINT IF EXISTS "Permission_pkey";
ALTER TABLE IF EXISTS ONLY public."PerformanceMetric" DROP CONSTRAINT IF EXISTS "PerformanceMetric_pkey";
ALTER TABLE IF EXISTS ONLY public."PatchNote" DROP CONSTRAINT IF EXISTS "PatchNote_pkey";
ALTER TABLE IF EXISTS ONLY public."Page" DROP CONSTRAINT IF EXISTS "Page_pkey";
ALTER TABLE IF EXISTS ONLY public."PageSection" DROP CONSTRAINT IF EXISTS "PageSection_pkey";
ALTER TABLE IF EXISTS ONLY public."OptimizationReport" DROP CONSTRAINT IF EXISTS "OptimizationReport_pkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_pkey";
ALTER TABLE IF EXISTS ONLY public."NotificationTemplate" DROP CONSTRAINT IF EXISTS "NotificationTemplate_pkey";
ALTER TABLE IF EXISTS ONLY public."NotificationRule" DROP CONSTRAINT IF EXISTS "NotificationRule_pkey";
ALTER TABLE IF EXISTS ONLY public."NotificationPreference" DROP CONSTRAINT IF EXISTS "NotificationPreference_pkey";
ALTER TABLE IF EXISTS ONLY public."NewsletterSubscriber" DROP CONSTRAINT IF EXISTS "NewsletterSubscriber_pkey";
ALTER TABLE IF EXISTS ONLY public."NewsArticle" DROP CONSTRAINT IF EXISTS "NewsArticle_pkey";
ALTER TABLE IF EXISTS ONLY public."NavigationMenu" DROP CONSTRAINT IF EXISTS "NavigationMenu_pkey";
ALTER TABLE IF EXISTS ONLY public."Metric" DROP CONSTRAINT IF EXISTS "Metric_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaUsage" DROP CONSTRAINT IF EXISTS "MediaUsage_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaTag" DROP CONSTRAINT IF EXISTS "MediaTag_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaFolder" DROP CONSTRAINT IF EXISTS "MediaFolder_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaCollection" DROP CONSTRAINT IF EXISTS "MediaCollection_pkey";
ALTER TABLE IF EXISTS ONLY public."MediaAsset" DROP CONSTRAINT IF EXISTS "MediaAsset_pkey";
ALTER TABLE IF EXISTS ONLY public."MarketingTemplate" DROP CONSTRAINT IF EXISTS "MarketingTemplate_pkey";
ALTER TABLE IF EXISTS ONLY public."KnowledgeCategory" DROP CONSTRAINT IF EXISTS "KnowledgeCategory_pkey";
ALTER TABLE IF EXISTS ONLY public."KnowledgeArticle" DROP CONSTRAINT IF EXISTS "KnowledgeArticle_pkey";
ALTER TABLE IF EXISTS ONLY public."InternalNote" DROP CONSTRAINT IF EXISTS "InternalNote_pkey";
ALTER TABLE IF EXISTS ONLY public."Integration" DROP CONSTRAINT IF EXISTS "Integration_pkey";
ALTER TABLE IF EXISTS ONLY public."HealthCheck" DROP CONSTRAINT IF EXISTS "HealthCheck_pkey";
ALTER TABLE IF EXISTS ONLY public."Game" DROP CONSTRAINT IF EXISTS "Game_pkey";
ALTER TABLE IF EXISTS ONLY public."GamePlatform" DROP CONSTRAINT IF EXISTS "GamePlatform_pkey";
ALTER TABLE IF EXISTS ONLY public."GameMedia" DROP CONSTRAINT IF EXISTS "GameMedia_pkey";
ALTER TABLE IF EXISTS ONLY public."GameFeature" DROP CONSTRAINT IF EXISTS "GameFeature_pkey";
ALTER TABLE IF EXISTS ONLY public."GameContent" DROP CONSTRAINT IF EXISTS "GameContent_pkey";
ALTER TABLE IF EXISTS ONLY public."FeatureFlag" DROP CONSTRAINT IF EXISTS "FeatureFlag_pkey";
ALTER TABLE IF EXISTS ONLY public."FAQItem" DROP CONSTRAINT IF EXISTS "FAQItem_pkey";
ALTER TABLE IF EXISTS ONLY public."ErrorLog" DROP CONSTRAINT IF EXISTS "ErrorLog_pkey";
ALTER TABLE IF EXISTS ONLY public."EmailLog" DROP CONSTRAINT IF EXISTS "EmailLog_pkey";
ALTER TABLE IF EXISTS ONLY public."EmailConfiguration" DROP CONSTRAINT IF EXISTS "EmailConfiguration_pkey";
ALTER TABLE IF EXISTS ONLY public."EmailCampaign" DROP CONSTRAINT IF EXISTS "EmailCampaign_pkey";
ALTER TABLE IF EXISTS ONLY public."Deployment" DROP CONSTRAINT IF EXISTS "Deployment_pkey";
ALTER TABLE IF EXISTS ONLY public."Department" DROP CONSTRAINT IF EXISTS "Department_pkey";
ALTER TABLE IF EXISTS ONLY public."DeliveryLog" DROP CONSTRAINT IF EXISTS "DeliveryLog_pkey";
ALTER TABLE IF EXISTS ONLY public."DatabaseBackupRecord" DROP CONSTRAINT IF EXISTS "DatabaseBackupRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."DashboardWidget" DROP CONSTRAINT IF EXISTS "DashboardWidget_pkey";
ALTER TABLE IF EXISTS ONLY public."DLC" DROP CONSTRAINT IF EXISTS "DLC_pkey";
ALTER TABLE IF EXISTS ONLY public."Customer" DROP CONSTRAINT IF EXISTS "Customer_pkey";
ALTER TABLE IF EXISTS ONLY public."CustomerSession" DROP CONSTRAINT IF EXISTS "CustomerSession_pkey";
ALTER TABLE IF EXISTS ONLY public."CustomerProfile" DROP CONSTRAINT IF EXISTS "CustomerProfile_pkey";
ALTER TABLE IF EXISTS ONLY public."CustomerPreference" DROP CONSTRAINT IF EXISTS "CustomerPreference_pkey";
ALTER TABLE IF EXISTS ONLY public."CustomerNotification" DROP CONSTRAINT IF EXISTS "CustomerNotification_pkey";
ALTER TABLE IF EXISTS ONLY public."ContentRevision" DROP CONSTRAINT IF EXISTS "ContentRevision_pkey";
ALTER TABLE IF EXISTS ONLY public."ContentBlock" DROP CONSTRAINT IF EXISTS "ContentBlock_pkey";
ALTER TABLE IF EXISTS ONLY public."ContactVerificationToken" DROP CONSTRAINT IF EXISTS "ContactVerificationToken_pkey";
ALTER TABLE IF EXISTS ONLY public."ContactTicket" DROP CONSTRAINT IF EXISTS "ContactTicket_pkey";
ALTER TABLE IF EXISTS ONLY public."CommunityEvent" DROP CONSTRAINT IF EXISTS "CommunityEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."CloudDeployment" DROP CONSTRAINT IF EXISTS "CloudDeployment_pkey";
ALTER TABLE IF EXISTS ONLY public."Career" DROP CONSTRAINT IF EXISTS "Career_pkey";
ALTER TABLE IF EXISTS ONLY public."Campaign" DROP CONSTRAINT IF EXISTS "Campaign_pkey";
ALTER TABLE IF EXISTS ONLY public."CampaignAnalyticsRecord" DROP CONSTRAINT IF EXISTS "CampaignAnalyticsRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."CacheRecord" DROP CONSTRAINT IF EXISTS "CacheRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."BuildHistory" DROP CONSTRAINT IF EXISTS "BuildHistory_pkey";
ALTER TABLE IF EXISTS ONLY public."BackupRecord" DROP CONSTRAINT IF EXISTS "BackupRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."AutomationLog" DROP CONSTRAINT IF EXISTS "AutomationLog_pkey";
ALTER TABLE IF EXISTS ONLY public."AuditLog" DROP CONSTRAINT IF EXISTS "AuditLog_pkey";
ALTER TABLE IF EXISTS ONLY public."AudienceSegment" DROP CONSTRAINT IF EXISTS "AudienceSegment_pkey";
ALTER TABLE IF EXISTS ONLY public."Article" DROP CONSTRAINT IF EXISTS "Article_pkey";
ALTER TABLE IF EXISTS ONLY public."Announcement" DROP CONSTRAINT IF EXISTS "Announcement_pkey";
ALTER TABLE IF EXISTS ONLY public."AnalyticsSession" DROP CONSTRAINT IF EXISTS "AnalyticsSession_pkey";
ALTER TABLE IF EXISTS ONLY public."AnalyticsReport" DROP CONSTRAINT IF EXISTS "AnalyticsReport_pkey";
ALTER TABLE IF EXISTS ONLY public."AnalyticsEvent" DROP CONSTRAINT IF EXISTS "AnalyticsEvent_pkey";
ALTER TABLE IF EXISTS ONLY public."Account" DROP CONSTRAINT IF EXISTS "Account_pkey";
ALTER TABLE IF EXISTS ONLY public."APIUsageRecord" DROP CONSTRAINT IF EXISTS "APIUsageRecord_pkey";
ALTER TABLE IF EXISTS ONLY public."APILog" DROP CONSTRAINT IF EXISTS "APILog_pkey";
ALTER TABLE IF EXISTS ONLY public."APIKey" DROP CONSTRAINT IF EXISTS "APIKey_pkey";
ALTER TABLE IF EXISTS ONLY public."APIEndpoint" DROP CONSTRAINT IF EXISTS "APIEndpoint_pkey";
ALTER TABLE IF EXISTS ONLY public."APIApplication" DROP CONSTRAINT IF EXISTS "APIApplication_pkey";
ALTER TABLE IF EXISTS ONLY public."AIUsage" DROP CONSTRAINT IF EXISTS "AIUsage_pkey";
ALTER TABLE IF EXISTS ONLY public."AISetting" DROP CONSTRAINT IF EXISTS "AISetting_pkey";
ALTER TABLE IF EXISTS ONLY public."AISearchLog" DROP CONSTRAINT IF EXISTS "AISearchLog_pkey";
ALTER TABLE IF EXISTS ONLY public."AIPrompt" DROP CONSTRAINT IF EXISTS "AIPrompt_pkey";
ALTER TABLE IF EXISTS ONLY public."AIMessage" DROP CONSTRAINT IF EXISTS "AIMessage_pkey";
ALTER TABLE IF EXISTS ONLY public."AIKnowledge" DROP CONSTRAINT IF EXISTS "AIKnowledge_pkey";
ALTER TABLE IF EXISTS ONLY public."AIHelpMessage" DROP CONSTRAINT IF EXISTS "AIHelpMessage_pkey";
ALTER TABLE IF EXISTS ONLY public."AIHelpConversation" DROP CONSTRAINT IF EXISTS "AIHelpConversation_pkey";
ALTER TABLE IF EXISTS ONLY public."AIFeedback" DROP CONSTRAINT IF EXISTS "AIFeedback_pkey";
ALTER TABLE IF EXISTS ONLY public."AIConversation" DROP CONSTRAINT IF EXISTS "AIConversation_pkey";
ALTER TABLE IF EXISTS ONLY public."AIConfiguration" DROP CONSTRAINT IF EXISTS "AIConfiguration_pkey";
ALTER TABLE IF EXISTS ONLY public."AIAnalysis" DROP CONSTRAINT IF EXISTS "AIAnalysis_pkey";
ALTER TABLE IF EXISTS ONLY public."AIActivity" DROP CONSTRAINT IF EXISTS "AIActivity_pkey";
DROP TABLE IF EXISTS public."WorkflowTrigger";
DROP TABLE IF EXISTS public."WorkflowExecution";
DROP TABLE IF EXISTS public."WorkflowCondition";
DROP TABLE IF EXISTS public."WorkflowAction";
DROP TABLE IF EXISTS public."Workflow";
DROP TABLE IF EXISTS public."WebhookEvent";
DROP TABLE IF EXISTS public."Webhook";
DROP TABLE IF EXISTS public."Visitor";
DROP TABLE IF EXISTS public."VerificationToken";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."UploadHistory";
DROP TABLE IF EXISTS public."TicketMessage";
DROP TABLE IF EXISTS public."TicketAttachment";
DROP TABLE IF EXISTS public."TicketActivity";
DROP TABLE IF EXISTS public."Ticket";
DROP TABLE IF EXISTS public."TestResult";
DROP TABLE IF EXISTS public."TeamMember";
DROP TABLE IF EXISTS public."SystemSetting";
DROP TABLE IF EXISTS public."SystemResource";
DROP TABLE IF EXISTS public."SystemLog";
DROP TABLE IF EXISTS public."SystemHealthCheck";
DROP TABLE IF EXISTS public."StorageConfiguration";
DROP TABLE IF EXISTS public."Session";
DROP TABLE IF EXISTS public."SecurityEvent";
DROP TABLE IF EXISTS public."SecurityAlert";
DROP TABLE IF EXISTS public."ScheduledJob";
DROP TABLE IF EXISTS public."SEOData";
DROP TABLE IF EXISTS public."Role";
DROP TABLE IF EXISTS public."Promotion";
DROP TABLE IF EXISTS public."ProductionEnvironment";
DROP TABLE IF EXISTS public."PressRelease";
DROP TABLE IF EXISTS public."Permission";
DROP TABLE IF EXISTS public."PerformanceMetric";
DROP TABLE IF EXISTS public."PatchNote";
DROP TABLE IF EXISTS public."PageSection";
DROP TABLE IF EXISTS public."Page";
DROP TABLE IF EXISTS public."OptimizationReport";
DROP TABLE IF EXISTS public."NotificationTemplate";
DROP TABLE IF EXISTS public."NotificationRule";
DROP TABLE IF EXISTS public."NotificationPreference";
DROP TABLE IF EXISTS public."Notification";
DROP TABLE IF EXISTS public."NewsletterSubscriber";
DROP TABLE IF EXISTS public."NewsArticle";
DROP TABLE IF EXISTS public."NavigationMenu";
DROP TABLE IF EXISTS public."Metric";
DROP TABLE IF EXISTS public."MediaUsage";
DROP TABLE IF EXISTS public."MediaTag";
DROP TABLE IF EXISTS public."MediaFolder";
DROP TABLE IF EXISTS public."MediaCollection";
DROP TABLE IF EXISTS public."MediaAsset";
DROP TABLE IF EXISTS public."MarketingTemplate";
DROP TABLE IF EXISTS public."KnowledgeCategory";
DROP TABLE IF EXISTS public."KnowledgeArticle";
DROP TABLE IF EXISTS public."InternalNote";
DROP TABLE IF EXISTS public."Integration";
DROP TABLE IF EXISTS public."HealthCheck";
DROP TABLE IF EXISTS public."GamePlatform";
DROP TABLE IF EXISTS public."GameMedia";
DROP TABLE IF EXISTS public."GameFeature";
DROP TABLE IF EXISTS public."GameContent";
DROP TABLE IF EXISTS public."Game";
DROP TABLE IF EXISTS public."FeatureFlag";
DROP TABLE IF EXISTS public."FAQItem";
DROP TABLE IF EXISTS public."ErrorLog";
DROP TABLE IF EXISTS public."EmailLog";
DROP TABLE IF EXISTS public."EmailConfiguration";
DROP TABLE IF EXISTS public."EmailCampaign";
DROP TABLE IF EXISTS public."Deployment";
DROP TABLE IF EXISTS public."Department";
DROP TABLE IF EXISTS public."DeliveryLog";
DROP TABLE IF EXISTS public."DatabaseBackupRecord";
DROP TABLE IF EXISTS public."DashboardWidget";
DROP TABLE IF EXISTS public."DLC";
DROP TABLE IF EXISTS public."CustomerSession";
DROP TABLE IF EXISTS public."CustomerProfile";
DROP TABLE IF EXISTS public."CustomerPreference";
DROP TABLE IF EXISTS public."CustomerNotification";
DROP TABLE IF EXISTS public."Customer";
DROP TABLE IF EXISTS public."ContentRevision";
DROP TABLE IF EXISTS public."ContentBlock";
DROP TABLE IF EXISTS public."ContactVerificationToken";
DROP TABLE IF EXISTS public."ContactTicket_Legacy_Backup";
DROP TABLE IF EXISTS public."ContactTicket";
DROP TABLE IF EXISTS public."CommunityEvent";
DROP TABLE IF EXISTS public."CloudDeployment";
DROP TABLE IF EXISTS public."Career";
DROP TABLE IF EXISTS public."CampaignAnalyticsRecord";
DROP TABLE IF EXISTS public."Campaign";
DROP TABLE IF EXISTS public."CacheRecord";
DROP TABLE IF EXISTS public."BuildHistory";
DROP TABLE IF EXISTS public."BackupRecord";
DROP TABLE IF EXISTS public."AutomationLog";
DROP TABLE IF EXISTS public."AuditLog";
DROP TABLE IF EXISTS public."AudienceSegment";
DROP TABLE IF EXISTS public."Article";
DROP TABLE IF EXISTS public."Announcement";
DROP TABLE IF EXISTS public."AnalyticsSession";
DROP TABLE IF EXISTS public."AnalyticsReport";
DROP TABLE IF EXISTS public."AnalyticsEvent";
DROP TABLE IF EXISTS public."Account";
DROP TABLE IF EXISTS public."APIUsageRecord";
DROP TABLE IF EXISTS public."APILog";
DROP TABLE IF EXISTS public."APIKey";
DROP TABLE IF EXISTS public."APIEndpoint";
DROP TABLE IF EXISTS public."APIApplication";
DROP TABLE IF EXISTS public."AIUsage";
DROP TABLE IF EXISTS public."AISetting";
DROP TABLE IF EXISTS public."AISearchLog";
DROP TABLE IF EXISTS public."AIPrompt";
DROP TABLE IF EXISTS public."AIMessage";
DROP TABLE IF EXISTS public."AIKnowledge";
DROP TABLE IF EXISTS public."AIHelpMessage";
DROP TABLE IF EXISTS public."AIHelpConversation";
DROP TABLE IF EXISTS public."AIFeedback";
DROP TABLE IF EXISTS public."AIConversation";
DROP TABLE IF EXISTS public."AIConfiguration";
DROP TABLE IF EXISTS public."AIAnalysis";
DROP TABLE IF EXISTS public."AIActivity";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AIActivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIActivity" (
    id text NOT NULL,
    action text NOT NULL,
    details text,
    "userEmail" text DEFAULT 'Admin'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIActivity" OWNER TO postgres;

--
-- Name: AIAnalysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIAnalysis" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    summary text NOT NULL,
    "detectedCategory" text,
    "detectedPriority" text,
    "spamScore" double precision DEFAULT 0 NOT NULL,
    "suggestedReply" text NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIAnalysis" OWNER TO postgres;

--
-- Name: AIConfiguration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIConfiguration" (
    id text NOT NULL,
    "defaultModel" text DEFAULT 'gemini-2.5-flash'::text NOT NULL,
    temperature double precision DEFAULT 0.7 NOT NULL,
    "tokenLimit" integer DEFAULT 8192 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AIConfiguration" OWNER TO postgres;

--
-- Name: AIConversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIConversation" (
    id text NOT NULL,
    title text NOT NULL,
    "userEmail" text DEFAULT 'Admin'::text NOT NULL,
    model text DEFAULT 'gemini-2.5-flash'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AIConversation" OWNER TO postgres;

--
-- Name: AIFeedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIFeedback" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIFeedback" OWNER TO postgres;

--
-- Name: AIHelpConversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIHelpConversation" (
    id text NOT NULL,
    "customerName" text DEFAULT 'Player'::text NOT NULL,
    "customerEmail" text DEFAULT 'player@dragonstudios.com'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AIHelpConversation" OWNER TO postgres;

--
-- Name: AIHelpMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIHelpMessage" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    sender text NOT NULL,
    text text NOT NULL,
    sources text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIHelpMessage" OWNER TO postgres;

--
-- Name: AIKnowledge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIKnowledge" (
    id text NOT NULL,
    topic text NOT NULL,
    category text DEFAULT 'Studio'::text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AIKnowledge" OWNER TO postgres;

--
-- Name: AIMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIMessage" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIMessage" OWNER TO postgres;

--
-- Name: AIPrompt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIPrompt" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "promptText" text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AIPrompt" OWNER TO postgres;

--
-- Name: AISearchLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AISearchLog" (
    id text NOT NULL,
    query text NOT NULL,
    resolved boolean DEFAULT true NOT NULL,
    "userEmail" text DEFAULT 'Visitor'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AISearchLog" OWNER TO postgres;

--
-- Name: AISetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AISetting" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AISetting" OWNER TO postgres;

--
-- Name: AIUsage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIUsage" (
    id text NOT NULL,
    feature text NOT NULL,
    model text DEFAULT 'gemini-2.5-flash'::text NOT NULL,
    tokens integer DEFAULT 0 NOT NULL,
    "responseTime" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    "userEmail" text DEFAULT 'Admin'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIUsage" OWNER TO postgres;

--
-- Name: APIApplication; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APIApplication" (
    id text NOT NULL,
    name text NOT NULL,
    developer text DEFAULT 'External Partner'::text NOT NULL,
    description text,
    permissions text DEFAULT 'READ_WRITE'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."APIApplication" OWNER TO postgres;

--
-- Name: APIEndpoint; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APIEndpoint" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    method text DEFAULT 'GET'::text NOT NULL,
    description text,
    permission text DEFAULT 'READ_ONLY'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."APIEndpoint" OWNER TO postgres;

--
-- Name: APIKey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APIKey" (
    id text NOT NULL,
    name text NOT NULL,
    "keyPrefix" text NOT NULL,
    "secretHash" text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdBy" text DEFAULT 'Admin'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."APIKey" OWNER TO postgres;

--
-- Name: APILog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APILog" (
    id text NOT NULL,
    endpoint text NOT NULL,
    method text DEFAULT 'GET'::text NOT NULL,
    "ipAddress" text DEFAULT '127.0.0.1'::text,
    "statusCode" integer DEFAULT 200 NOT NULL,
    latency integer DEFAULT 28 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."APILog" OWNER TO postgres;

--
-- Name: APIUsageRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APIUsageRecord" (
    id text NOT NULL,
    "appName" text NOT NULL,
    requests integer DEFAULT 0 NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."APIUsageRecord" OWNER TO postgres;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: AnalyticsEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnalyticsEvent" (
    id text NOT NULL,
    event text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "userEmail" text DEFAULT 'Visitor'::text,
    "ipAddress" text,
    metadata text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AnalyticsEvent" OWNER TO postgres;

--
-- Name: AnalyticsReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnalyticsReport" (
    id text NOT NULL,
    title text NOT NULL,
    type text DEFAULT 'DAILY'::text NOT NULL,
    data text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AnalyticsReport" OWNER TO postgres;

--
-- Name: AnalyticsSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnalyticsSession" (
    id text NOT NULL,
    "sessionKey" text NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    "pageViews" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AnalyticsSession" OWNER TO postgres;

--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    target text DEFAULT 'GLOBAL_WEBSITE'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Announcement" OWNER TO postgres;

--
-- Name: Article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Article" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    tag text NOT NULL,
    "readTime" text DEFAULT '4 min read'::text NOT NULL,
    author text DEFAULT 'Dragon Studios Editorial'::text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Article" OWNER TO postgres;

--
-- Name: AudienceSegment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AudienceSegment" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    filter text DEFAULT 'ACTIVE_30_DAYS'::text NOT NULL,
    size integer DEFAULT 120000 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AudienceSegment" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    "userEmail" text,
    action text NOT NULL,
    resource text,
    details text,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: AutomationLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AutomationLog" (
    id text NOT NULL,
    workflow text NOT NULL,
    event text NOT NULL,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AutomationLog" OWNER TO postgres;

--
-- Name: BackupRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BackupRecord" (
    id text NOT NULL,
    filename text NOT NULL,
    size text NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "createdBy" text DEFAULT 'Automated System'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BackupRecord" OWNER TO postgres;

--
-- Name: BuildHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BuildHistory" (
    id text NOT NULL,
    "buildNum" integer NOT NULL,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    duration text DEFAULT '10.5s'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BuildHistory" OWNER TO postgres;

--
-- Name: CacheRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CacheRecord" (
    id text NOT NULL,
    key text NOT NULL,
    "hitCount" integer DEFAULT 1 NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CacheRecord" OWNER TO postgres;

--
-- Name: Campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Campaign" (
    id text NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'Product Launch'::text NOT NULL,
    audience text DEFAULT 'All Active Players'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    reach integer DEFAULT 45000 NOT NULL,
    "openRate" double precision DEFAULT 42.8 NOT NULL,
    "clickRate" double precision DEFAULT 18.5 NOT NULL,
    conversions integer DEFAULT 2420 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Campaign" OWNER TO postgres;

--
-- Name: CampaignAnalyticsRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CampaignAnalyticsRecord" (
    id text NOT NULL,
    "campaignId" text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    clicks integer DEFAULT 0 NOT NULL,
    conversions integer DEFAULT 0 NOT NULL,
    "recordedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CampaignAnalyticsRecord" OWNER TO postgres;

--
-- Name: Career; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Career" (
    id text NOT NULL,
    title text NOT NULL,
    department text NOT NULL,
    location text DEFAULT 'Bengaluru / Remote'::text NOT NULL,
    type text DEFAULT 'Full-Time'::text NOT NULL,
    description text NOT NULL,
    requirements text NOT NULL,
    salary text,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Career" OWNER TO postgres;

--
-- Name: CloudDeployment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CloudDeployment" (
    id text NOT NULL,
    version text NOT NULL,
    branch text DEFAULT 'main'::text NOT NULL,
    commit text DEFAULT 'a8f9c1e'::text NOT NULL,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    "deployedBy" text DEFAULT 'DevOps Pipeline'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CloudDeployment" OWNER TO postgres;

--
-- Name: CommunityEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CommunityEvent" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    location text DEFAULT 'Online / Esports Arena'::text NOT NULL,
    "prizePool" text DEFAULT '$50,000'::text NOT NULL,
    "registeredCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CommunityEvent" OWNER TO postgres;

--
-- Name: ContactTicket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactTicket" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "trackingToken" text,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    phone text,
    category text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "assignedStaff" text,
    "internalNotes" text,
    attachments text,
    tags text,
    device text,
    archived boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    "ipAddress" text,
    country text,
    browser text,
    os text,
    language text,
    timezone text,
    "verifiedAt" timestamp(3) without time zone,
    "aiSummary" text,
    "aiCategory" text,
    "aiUrgency" text,
    "aiSpamScore" double precision DEFAULT 0,
    "aiSuggestedReply" text,
    "aiKeywords" text,
    "aiTags" text,
    "estimatedResponse" text DEFAULT 'Within 24 Hours'::text,
    replied boolean DEFAULT false NOT NULL,
    "closedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ContactTicket" OWNER TO postgres;

--
-- Name: ContactTicket_Legacy_Backup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactTicket_Legacy_Backup" (
    id text,
    "ticketId" text,
    "trackingToken" text,
    name text,
    email text,
    company text,
    phone text,
    category text,
    subject text,
    message text,
    priority text,
    status text,
    "assignedStaff" text,
    "internalNotes" text,
    attachments text,
    tags text,
    device text,
    archived boolean,
    deleted boolean,
    "ipAddress" text,
    country text,
    browser text,
    os text,
    language text,
    timezone text,
    "verifiedAt" timestamp(3) without time zone,
    "aiSummary" text,
    "aiCategory" text,
    "aiUrgency" text,
    "aiSpamScore" double precision,
    "aiSuggestedReply" text,
    "aiKeywords" text,
    "aiTags" text,
    "estimatedResponse" text,
    replied boolean,
    "closedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."ContactTicket_Legacy_Backup" OWNER TO postgres;

--
-- Name: ContactVerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactVerificationToken" (
    id text NOT NULL,
    token text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    company text,
    phone text,
    category text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    "ipAddress" text,
    country text,
    browser text,
    os text,
    language text,
    timezone text,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContactVerificationToken" OWNER TO postgres;

--
-- Name: ContentBlock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContentBlock" (
    id text NOT NULL,
    key text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    label text NOT NULL,
    type text DEFAULT 'text'::text NOT NULL,
    content text NOT NULL,
    "draftContent" text,
    "isPublished" boolean DEFAULT true NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "updatedBy" text DEFAULT 'Admin'::text NOT NULL,
    "sectionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ContentBlock" OWNER TO postgres;

--
-- Name: ContentRevision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContentRevision" (
    id text NOT NULL,
    "pageId" text,
    "blockKey" text,
    version integer DEFAULT 1 NOT NULL,
    content text NOT NULL,
    "changedBy" text DEFAULT 'Admin'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContentRevision" OWNER TO postgres;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    country text DEFAULT 'Global'::text,
    language text DEFAULT 'English'::text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: CustomerNotification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomerNotification" (
    id text NOT NULL,
    "profileId" text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CustomerNotification" OWNER TO postgres;

--
-- Name: CustomerPreference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomerPreference" (
    id text NOT NULL,
    "profileId" text NOT NULL,
    "emailUpdateAlerts" boolean DEFAULT true NOT NULL,
    "securityAlerts" boolean DEFAULT true NOT NULL,
    "marketingEmails" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."CustomerPreference" OWNER TO postgres;

--
-- Name: CustomerProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomerProfile" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    avatar text,
    language text DEFAULT 'English'::text NOT NULL,
    timezone text DEFAULT 'UTC'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CustomerProfile" OWNER TO postgres;

--
-- Name: CustomerSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomerSession" (
    id text NOT NULL,
    "profileId" text NOT NULL,
    "sessionToken" text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CustomerSession" OWNER TO postgres;

--
-- Name: DLC; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DLC" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price text DEFAULT '$19.99'::text,
    status text DEFAULT 'AVAILABLE'::text NOT NULL
);


ALTER TABLE public."DLC" OWNER TO postgres;

--
-- Name: DashboardWidget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DashboardWidget" (
    id text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DashboardWidget" OWNER TO postgres;

--
-- Name: DatabaseBackupRecord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DatabaseBackupRecord" (
    id text NOT NULL,
    filename text NOT NULL,
    size text NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "storageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DatabaseBackupRecord" OWNER TO postgres;

--
-- Name: DeliveryLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DeliveryLog" (
    id text NOT NULL,
    recipient text NOT NULL,
    channel text DEFAULT 'EMAIL'::text NOT NULL,
    status text DEFAULT 'DELIVERED'::text NOT NULL,
    "errorMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."DeliveryLog" OWNER TO postgres;

--
-- Name: Department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Department" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Department" OWNER TO postgres;

--
-- Name: Deployment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Deployment" (
    id text NOT NULL,
    version text NOT NULL,
    environment text DEFAULT 'PRODUCTION'::text NOT NULL,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    "deployedBy" text DEFAULT 'DevOps Automated'::text NOT NULL,
    "commitHash" text DEFAULT 'a8f9c1e'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Deployment" OWNER TO postgres;

--
-- Name: EmailCampaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmailCampaign" (
    id text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    "sentCount" integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'DISPATCHED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EmailCampaign" OWNER TO postgres;

--
-- Name: EmailConfiguration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmailConfiguration" (
    id text NOT NULL,
    "smtpHost" text DEFAULT 'smtp.dragonstudios.com'::text NOT NULL,
    "smtpPort" integer DEFAULT 587 NOT NULL,
    username text DEFAULT 'notifications@dragonstudios.com'::text NOT NULL,
    "senderEmail" text DEFAULT 'support@dragonstudios.com'::text NOT NULL,
    "senderName" text DEFAULT 'Dragon Studios Enterprise'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmailConfiguration" OWNER TO postgres;

--
-- Name: EmailLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmailLog" (
    id text NOT NULL,
    "ticketId" text,
    recipient text NOT NULL,
    subject text NOT NULL,
    status text DEFAULT 'DISPATCHED'::text NOT NULL,
    "errorMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EmailLog" OWNER TO postgres;

--
-- Name: ErrorLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ErrorLog" (
    id text NOT NULL,
    message text NOT NULL,
    stack text,
    source text DEFAULT 'SERVER'::text NOT NULL,
    "userEmail" text DEFAULT 'System'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ErrorLog" OWNER TO postgres;

--
-- Name: FAQItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FAQItem" (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."FAQItem" OWNER TO postgres;

--
-- Name: FeatureFlag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeatureFlag" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FeatureFlag" OWNER TO postgres;

--
-- Name: Game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Game" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    subtitle text,
    genre text NOT NULL,
    status text NOT NULL,
    year text NOT NULL,
    description text NOT NULL,
    "fullDescription" text,
    palette text DEFAULT 'from-[#df5033] via-[#361914] to-[#070709]'::text NOT NULL,
    "accentColor" text DEFAULT '#df5033'::text NOT NULL,
    "glowColor" text DEFAULT 'rgba(223, 80, 51, 0.4)'::text NOT NULL,
    platforms text DEFAULT 'PC,PS5,Xbox Series X'::text NOT NULL,
    tags text DEFAULT 'Open World,Ray Tracing'::text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    "heroImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Game" OWNER TO postgres;

--
-- Name: GameContent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GameContent" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    subtitle text,
    genre text NOT NULL,
    status text DEFAULT 'In Development'::text NOT NULL,
    "releaseDate" text NOT NULL,
    developer text DEFAULT 'Dragon Studios'::text NOT NULL,
    publisher text DEFAULT 'Dragon Interactive'::text NOT NULL,
    engine text DEFAULT 'Dragon Engine v5.4'::text NOT NULL,
    platforms text NOT NULL,
    description text NOT NULL,
    "logoUrl" text,
    "bannerUrl" text,
    "heroVideoUrl" text,
    features text,
    requirements text,
    "isPublished" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GameContent" OWNER TO postgres;

--
-- Name: GameFeature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GameFeature" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon text
);


ALTER TABLE public."GameFeature" OWNER TO postgres;

--
-- Name: GameMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GameMedia" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    type text NOT NULL,
    url text NOT NULL,
    title text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GameMedia" OWNER TO postgres;

--
-- Name: GamePlatform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GamePlatform" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    name text NOT NULL,
    "storeUrl" text,
    "releaseDate" text
);


ALTER TABLE public."GamePlatform" OWNER TO postgres;

--
-- Name: HealthCheck; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HealthCheck" (
    id text NOT NULL,
    service text NOT NULL,
    status text DEFAULT 'HEALTHY'::text NOT NULL,
    latency double precision DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."HealthCheck" OWNER TO postgres;

--
-- Name: Integration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Integration" (
    id text NOT NULL,
    name text NOT NULL,
    provider text NOT NULL,
    status text DEFAULT 'CONNECTED'::text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    config text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Integration" OWNER TO postgres;

--
-- Name: InternalNote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InternalNote" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    author text NOT NULL,
    note text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InternalNote" OWNER TO postgres;

--
-- Name: KnowledgeArticle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnowledgeArticle" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    category text DEFAULT 'Technical Support'::text NOT NULL,
    tags text DEFAULT 'Guide, Troubleshooting'::text NOT NULL,
    author text DEFAULT 'Dragon Support Lead'::text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'PUBLISHED'::text NOT NULL,
    helpful integer DEFAULT 0 NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."KnowledgeArticle" OWNER TO postgres;

--
-- Name: KnowledgeCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnowledgeCategory" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    icon text DEFAULT 'BookOpen'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."KnowledgeCategory" OWNER TO postgres;

--
-- Name: MarketingTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MarketingTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    category text DEFAULT 'Email Newsletter'::text NOT NULL,
    "htmlContent" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MarketingTemplate" OWNER TO postgres;

--
-- Name: MediaAsset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaAsset" (
    id text NOT NULL,
    name text NOT NULL,
    size text NOT NULL,
    type text NOT NULL,
    "mimeType" text DEFAULT 'image/png'::text,
    category text DEFAULT 'Images'::text NOT NULL,
    url text NOT NULL,
    "altText" text,
    dimensions text DEFAULT '1920x1080'::text,
    "folderId" text,
    "uploaderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MediaAsset" OWNER TO postgres;

--
-- Name: MediaCollection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaCollection" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MediaCollection" OWNER TO postgres;

--
-- Name: MediaFolder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaFolder" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    path text DEFAULT '/'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MediaFolder" OWNER TO postgres;

--
-- Name: MediaTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaTag" (
    id text NOT NULL,
    "assetId" text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."MediaTag" OWNER TO postgres;

--
-- Name: MediaUsage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaUsage" (
    id text NOT NULL,
    "assetId" text NOT NULL,
    location text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MediaUsage" OWNER TO postgres;

--
-- Name: Metric; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Metric" (
    id text NOT NULL,
    name text NOT NULL,
    value double precision NOT NULL,
    unit text DEFAULT 'count'::text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Metric" OWNER TO postgres;

--
-- Name: NavigationMenu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NavigationMenu" (
    id text NOT NULL,
    name text NOT NULL,
    items text NOT NULL,
    "updatedBy" text DEFAULT 'Admin'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NavigationMenu" OWNER TO postgres;

--
-- Name: NewsArticle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NewsArticle" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    author text DEFAULT 'Dragon Dispatches'::text NOT NULL,
    category text DEFAULT 'Game Updates'::text NOT NULL,
    tags text DEFAULT 'News, Update'::text NOT NULL,
    "featuredImage" text,
    status text DEFAULT 'PUBLISHED'::text NOT NULL,
    "publishedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NewsArticle" OWNER TO postgres;

--
-- Name: NewsletterSubscriber; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NewsletterSubscriber" (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NewsletterSubscriber" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'INFO'::text NOT NULL,
    recipient text DEFAULT 'All Staff'::text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    channel text DEFAULT 'IN_APP'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: NotificationPreference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationPreference" (
    id text NOT NULL,
    "userEmail" text NOT NULL,
    "emailAlert" boolean DEFAULT true NOT NULL,
    "inAppAlert" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NotificationPreference" OWNER TO postgres;

--
-- Name: NotificationRule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationRule" (
    id text NOT NULL,
    event text NOT NULL,
    channel text DEFAULT 'EMAIL'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NotificationRule" OWNER TO postgres;

--
-- Name: NotificationTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NotificationTemplate" OWNER TO postgres;

--
-- Name: OptimizationReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OptimizationReport" (
    id text NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."OptimizationReport" OWNER TO postgres;

--
-- Name: Page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Page" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    status text DEFAULT 'PUBLISHED'::text NOT NULL,
    author text DEFAULT 'Dragon CMS Team'::text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Page" OWNER TO postgres;

--
-- Name: PageSection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PageSection" (
    id text NOT NULL,
    "pageId" text NOT NULL,
    title text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    visible boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PageSection" OWNER TO postgres;

--
-- Name: PatchNote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PatchNote" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    version text NOT NULL,
    title text NOT NULL,
    changes text NOT NULL,
    "releasedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PatchNote" OWNER TO postgres;

--
-- Name: PerformanceMetric; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PerformanceMetric" (
    id text NOT NULL,
    name text NOT NULL,
    value double precision NOT NULL,
    unit text DEFAULT 'ms'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PerformanceMetric" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    "roleId" text NOT NULL,
    action text NOT NULL,
    resource text NOT NULL,
    granted boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: PressRelease; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PressRelease" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    "releaseDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "pdfUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PressRelease" OWNER TO postgres;

--
-- Name: ProductionEnvironment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductionEnvironment" (
    id text NOT NULL,
    name text NOT NULL,
    domain text DEFAULT 'admin.dragonstudios.com'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductionEnvironment" OWNER TO postgres;

--
-- Name: Promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Promotion" (
    id text NOT NULL,
    code text NOT NULL,
    discount text DEFAULT '25% OFF'::text NOT NULL,
    "usageLimit" integer DEFAULT 1000 NOT NULL,
    "usageCount" integer DEFAULT 142 NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Promotion" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isCustom" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: SEOData; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SEOData" (
    id text NOT NULL,
    "pageId" text,
    "metaTitle" text NOT NULL,
    "metaDescription" text NOT NULL,
    keywords text NOT NULL,
    "ogImage" text,
    "canonicalUrl" text,
    robots text DEFAULT 'index, follow'::text NOT NULL,
    "structuredData" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SEOData" OWNER TO postgres;

--
-- Name: ScheduledJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ScheduledJob" (
    id text NOT NULL,
    name text NOT NULL,
    cron text DEFAULT '0 0 * * *'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "lastRunAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ScheduledJob" OWNER TO postgres;

--
-- Name: SecurityAlert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SecurityAlert" (
    id text NOT NULL,
    title text NOT NULL,
    severity text DEFAULT 'HIGH'::text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    details text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SecurityAlert" OWNER TO postgres;

--
-- Name: SecurityEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SecurityEvent" (
    id text NOT NULL,
    "eventType" text NOT NULL,
    severity text DEFAULT 'MEDIUM'::text NOT NULL,
    "userEmail" text DEFAULT 'Unknown'::text,
    "ipAddress" text,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SecurityEvent" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "sessionToken" text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: StorageConfiguration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StorageConfiguration" (
    id text NOT NULL,
    provider text DEFAULT 'LOCAL'::text NOT NULL,
    "bucketName" text DEFAULT 'dragon-media-production'::text NOT NULL,
    region text DEFAULT 'us-east-1'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StorageConfiguration" OWNER TO postgres;

--
-- Name: SystemHealthCheck; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemHealthCheck" (
    id text NOT NULL,
    endpoint text NOT NULL,
    status text DEFAULT 'UP'::text NOT NULL,
    "httpStatus" integer DEFAULT 200 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemHealthCheck" OWNER TO postgres;

--
-- Name: SystemLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemLog" (
    id text NOT NULL,
    level text DEFAULT 'INFO'::text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SystemLog" OWNER TO postgres;

--
-- Name: SystemResource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemResource" (
    id text NOT NULL,
    "nodeId" text DEFAULT 'node-us-east-1a'::text NOT NULL,
    "cpuUsage" double precision DEFAULT 14.2 NOT NULL,
    "memoryUsage" double precision DEFAULT 38.4 NOT NULL,
    "diskUsage" double precision DEFAULT 24.8 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemResource" OWNER TO postgres;

--
-- Name: SystemSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemSetting" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    category text DEFAULT 'General'::text NOT NULL,
    description text,
    "updatedBy" text DEFAULT 'Super Admin'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemSetting" OWNER TO postgres;

--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamMember" (
    id text NOT NULL,
    "departmentId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'Support Agent'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TeamMember" OWNER TO postgres;

--
-- Name: TestResult; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TestResult" (
    id text NOT NULL,
    "testName" text NOT NULL,
    category text DEFAULT 'UNIT'::text NOT NULL,
    status text DEFAULT 'PASSED'::text NOT NULL,
    duration double precision DEFAULT 0 NOT NULL,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TestResult" OWNER TO postgres;

--
-- Name: Ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ticket" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "customerId" text,
    "customerName" text NOT NULL,
    "customerEmail" text NOT NULL,
    category text NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    status text DEFAULT 'NEW'::text NOT NULL,
    "assignedAgent" text,
    department text DEFAULT 'Support'::text NOT NULL,
    tags text DEFAULT 'Inbound'::text,
    "lastReplyAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "closedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" character varying(255) DEFAULT 'dragon_studios'::character varying,
    "createdByType" character varying(255) DEFAULT 'CUSTOMER'::character varying,
    source character varying(255) DEFAULT 'ADMIN_CREATED'::character varying,
    "legacyContactTicketId" character varying(255),
    "migrationDate" timestamp without time zone,
    "deletedAt" timestamp without time zone,
    deleted boolean DEFAULT false
);


ALTER TABLE public."Ticket" OWNER TO postgres;

--
-- Name: TicketActivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TicketActivity" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    action text NOT NULL,
    details text,
    performer text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TicketActivity" OWNER TO postgres;

--
-- Name: TicketAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TicketAttachment" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "fileName" text NOT NULL,
    "fileSize" text NOT NULL,
    "fileType" text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TicketAttachment" OWNER TO postgres;

--
-- Name: TicketMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TicketMessage" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "senderType" text DEFAULT 'CUSTOMER'::text,
    "senderName" text NOT NULL,
    "senderEmail" text,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sender text DEFAULT 'CUSTOMER'::text,
    "contactTicketId" text
);


ALTER TABLE public."TicketMessage" OWNER TO postgres;

--
-- Name: UploadHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UploadHistory" (
    id text NOT NULL,
    "fileName" text NOT NULL,
    "fileSize" text NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UploadHistory" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    password text,
    role text DEFAULT 'ADMINISTRATOR'::text NOT NULL,
    department text DEFAULT 'Engineering'::text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    avatar text,
    "mfaEnabled" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Name: Visitor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Visitor" (
    id text NOT NULL,
    "ipAddress" text NOT NULL,
    country text DEFAULT 'United States'::text,
    language text DEFAULT 'en-US'::text,
    device text DEFAULT 'Desktop'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Visitor" OWNER TO postgres;

--
-- Name: Webhook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Webhook" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    events text DEFAULT 'NEW_USER,NEW_TICKET,GAME_PUBLISHED'::text NOT NULL,
    "secretKey" text DEFAULT 'whsec_9a8f7c1'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Webhook" OWNER TO postgres;

--
-- Name: WebhookEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WebhookEvent" (
    id text NOT NULL,
    event text NOT NULL,
    payload text NOT NULL,
    status text DEFAULT 'DELIVERED'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WebhookEvent" OWNER TO postgres;

--
-- Name: Workflow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Workflow" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    category text DEFAULT 'CRM'::text NOT NULL,
    "triggerType" text DEFAULT 'CRM_TICKET_CREATED'::text NOT NULL,
    "actionType" text DEFAULT 'SEND_EMAIL_DISPATCH'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Workflow" OWNER TO postgres;

--
-- Name: WorkflowAction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkflowAction" (
    id text NOT NULL,
    "workflowId" text NOT NULL,
    "actionType" text NOT NULL,
    config text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WorkflowAction" OWNER TO postgres;

--
-- Name: WorkflowCondition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkflowCondition" (
    id text NOT NULL,
    "workflowId" text NOT NULL,
    operator text DEFAULT 'IF'::text NOT NULL,
    field text NOT NULL,
    comparison text DEFAULT 'EQUALS'::text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WorkflowCondition" OWNER TO postgres;

--
-- Name: WorkflowExecution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkflowExecution" (
    id text NOT NULL,
    "workflowId" text NOT NULL,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    duration integer DEFAULT 120 NOT NULL,
    error text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WorkflowExecution" OWNER TO postgres;

--
-- Name: WorkflowTrigger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkflowTrigger" (
    id text NOT NULL,
    "workflowId" text NOT NULL,
    "eventType" text NOT NULL,
    payload text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WorkflowTrigger" OWNER TO postgres;

--
-- Data for Name: AIActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIActivity" (id, action, details, "userEmail", "createdAt") FROM stdin;
\.


--
-- Data for Name: AIAnalysis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIAnalysis" (id, "ticketId", summary, "detectedCategory", "detectedPriority", "spamScore", "suggestedReply", approved, "createdAt") FROM stdin;
\.


--
-- Data for Name: AIConfiguration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIConfiguration" (id, "defaultModel", temperature, "tokenLimit", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AIConversation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIConversation" (id, title, "userEmail", model, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AIFeedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIFeedback" (id, "conversationId", rating, comment, "createdAt") FROM stdin;
\.


--
-- Data for Name: AIHelpConversation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIHelpConversation" (id, "customerName", "customerEmail", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AIHelpMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIHelpMessage" (id, "conversationId", sender, text, sources, "createdAt") FROM stdin;
\.


--
-- Data for Name: AIKnowledge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIKnowledge" (id, topic, category, content, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AIMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIMessage" (id, "conversationId", role, content, "createdAt") FROM stdin;
\.


--
-- Data for Name: AIPrompt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIPrompt" (id, key, title, category, "promptText", active, version, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AISearchLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AISearchLog" (id, query, resolved, "userEmail", "createdAt") FROM stdin;
\.


--
-- Data for Name: AISetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AISetting" (id, key, value, description, "updatedAt") FROM stdin;
\.


--
-- Data for Name: AIUsage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIUsage" (id, feature, model, tokens, "responseTime", status, "userEmail", "createdAt") FROM stdin;
cmsbfslcc0006tq4o86wtvl9v	chat	gemini-2.5-flash	350	0.002	SUCCESS	Admin	2026-08-02 06:46:11.724
cmsbftgzi0008tq4olf8nwbe9	chat	gemini-2.5-flash	350	1.849	SUCCESS	Admin	2026-08-02 06:46:52.733
cmsbftvkr000atq4onkf91p8t	chat	gemini-2.5-flash	350	2.723	SUCCESS	Admin	2026-08-02 06:47:11.643
\.


--
-- Data for Name: APIApplication; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APIApplication" (id, name, developer, description, permissions, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: APIEndpoint; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APIEndpoint" (id, name, url, method, description, permission, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: APIKey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APIKey" (id, name, "keyPrefix", "secretHash", active, "createdBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: APILog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APILog" (id, endpoint, method, "ipAddress", "statusCode", latency, "createdAt") FROM stdin;
\.


--
-- Data for Name: APIUsageRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APIUsageRecord" (id, "appName", requests, date) FROM stdin;
\.


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AnalyticsEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnalyticsEvent" (id, event, category, "userEmail", "ipAddress", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: AnalyticsReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnalyticsReport" (id, title, type, data, "createdAt") FROM stdin;
\.


--
-- Data for Name: AnalyticsSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnalyticsSession" (id, "sessionKey", duration, "pageViews", "createdAt") FROM stdin;
\.


--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Announcement" (id, title, body, target, active, "createdAt") FROM stdin;
\.


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Article" (id, slug, title, excerpt, tag, "readTime", author, featured, "imageUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AudienceSegment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AudienceSegment" (id, name, description, filter, size, "createdAt") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "userId", "userEmail", action, resource, details, "ipAddress", "createdAt") FROM stdin;
cmsbf9t6z0002tqgkq7czlycd	cmsbf9t6t0000tqgkeq9a26fr	owner@dragonstudios.com	OWNER_ACCOUNT_PROVISIONED	USER_SEED	Owner account provisioned with bcrypt password hash	\N	2026-08-02 06:31:35.435
cmsbfkm2r0003tq4ox7gsnq5x	cmsbf9t6t0000tqgkeq9a26fr	owner@dragonstudios.com	USER_LOGIN_SUCCESS	AUTH_SESSION	User logged in from ::1	\N	2026-08-02 06:39:59.427
cmsbfoesn0005tq4o52gd8rgd	\N	Admin	CREATE_GAME	\N	Saved Game Title: hello (hello)	\N	2026-08-02 06:42:56.615
cmsbfslcg0007tq4o8gngi1k1	\N	Admin	EXECUTE_AI_FEATURE	\N	Executed AI feature [chat] in 0.00s	\N	2026-08-02 06:46:11.728
cmsbftgzk0009tq4o6b24icvy	\N	Admin	EXECUTE_AI_FEATURE	\N	Executed AI feature [chat] in 1.85s	\N	2026-08-02 06:46:52.736
cmsbftvkw000btq4oy52q3fgk	\N	Admin	EXECUTE_AI_FEATURE	\N	Executed AI feature [chat] in 2.72s	\N	2026-08-02 06:47:11.649
cmsbibe270001tqg4a9nup4d6	\N	whitedash99@gmail.com	DISPATCH_SUPPORT_REPLY	\N	Agent Dragon Support Agent replied to Ticket DRG-2026-000001	\N	2026-08-02 07:56:47.983
cmsbkc83b0001tqcgcj6jwet4	\N	t93618211@gmail.com	DISPATCH_SUPPORT_REPLY	\N	Agent Dragon Support Agent replied to Ticket DRG-2026-000002	\N	2026-08-02 08:53:26.135
cmsbkcell0003tqcgys2cld34	\N	t93618211@gmail.com	DISPATCH_SUPPORT_REPLY	\N	Agent Dragon Support Agent replied to Ticket DRG-2026-000002	\N	2026-08-02 08:53:34.569
\.


--
-- Data for Name: AutomationLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AutomationLog" (id, workflow, event, status, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: BackupRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BackupRecord" (id, filename, size, status, "createdBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: BuildHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BuildHistory" (id, "buildNum", status, duration, "createdAt") FROM stdin;
\.


--
-- Data for Name: CacheRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CacheRecord" (id, key, "hitCount", "expiresAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Campaign" (id, name, type, audience, status, reach, "openRate", "clickRate", conversions, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CampaignAnalyticsRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CampaignAnalyticsRecord" (id, "campaignId", views, clicks, conversions, "recordedAt") FROM stdin;
\.


--
-- Data for Name: Career; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Career" (id, title, department, location, type, description, requirements, salary, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CloudDeployment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CloudDeployment" (id, version, branch, commit, status, "deployedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: CommunityEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CommunityEvent" (id, title, slug, date, location, "prizePool", "registeredCount", "createdAt") FROM stdin;
\.


--
-- Data for Name: ContactTicket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactTicket" (id, "ticketId", "trackingToken", name, email, company, phone, category, subject, message, priority, status, "assignedStaff", "internalNotes", attachments, tags, device, archived, deleted, "ipAddress", country, browser, os, language, timezone, "verifiedAt", "aiSummary", "aiCategory", "aiUrgency", "aiSpamScore", "aiSuggestedReply", "aiKeywords", "aiTags", "estimatedResponse", replied, "closedAt", "createdAt", "updatedAt") FROM stdin;
cmsbgvawp00004gtqj16j86b3	DRG-2026-000001	296c874d7202ec12920967a9f48ec88a	hello	whitedash99@gmail.com	\N	\N	Technical Support	1234567885	nbmn mn mn	NORMAL	INVESTIGATING	\N	\N	\N	\N	\N	f	f	::1	Global	Google Chrome	Windows OS	en-US	UTC	2026-08-02 07:16:17.77	nbmn mn mn	Technical Support	NORMAL	0.05	Hello hello,\n\nThank you for reaching out to Dragon Studios Command Center regarding "1234567885".\n\nOur Technical Support engineering team has reviewed your inquiry. We are currently analyzing the specifications provided and will dispatch a comprehensive technical response shortly.\n\nIf you have additional attachments or context to provide, please reply directly to this thread or track your ticket status at our Support Center.\n\nBest regards,\nDragon Studios Support Team	1234567885	TECHNICAL_SUPPORT, URGENCY_NORMAL	Within 24 Hours	t	\N	2026-08-02 07:16:17.785	2026-08-02 07:56:47.952
cmsbkalow0000xstqv6tnhgp3	DRG-2026-000002	d8d7039add2c054e46ace2f937651bea	hello who are you	t93618211@gmail.com	\N	\N	Technical Support	hello	vdmmv zmds v	NORMAL	INVESTIGATING	\N	\N	\N	\N	\N	f	f	::1	Global	Google Chrome	Windows OS	en-US	UTC	2026-08-02 08:52:10.428	vdmmv zmds v	Technical Support	NORMAL	0.05	Hello hello who are you,\n\nThank you for reaching out to Dragon Studios Command Center regarding "hello".\n\nOur Technical Support engineering team has reviewed your inquiry. We are currently analyzing the specifications provided and will dispatch a comprehensive technical response shortly.\n\nIf you have additional attachments or context to provide, please reply directly to this thread or track your ticket status at our Support Center.\n\nBest regards,\nDragon Studios Support Team	hello, vdmmv	TECHNICAL_SUPPORT, URGENCY_NORMAL	Within 24 Hours	t	\N	2026-08-02 08:52:10.448	2026-08-02 08:53:34.549
\.


--
-- Data for Name: ContactTicket_Legacy_Backup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactTicket_Legacy_Backup" (id, "ticketId", "trackingToken", name, email, company, phone, category, subject, message, priority, status, "assignedStaff", "internalNotes", attachments, tags, device, archived, deleted, "ipAddress", country, browser, os, language, timezone, "verifiedAt", "aiSummary", "aiCategory", "aiUrgency", "aiSpamScore", "aiSuggestedReply", "aiKeywords", "aiTags", "estimatedResponse", replied, "closedAt", "createdAt", "updatedAt") FROM stdin;
cmsbgvawp00004gtqj16j86b3	DRG-2026-000001	296c874d7202ec12920967a9f48ec88a	hello	whitedash99@gmail.com	\N	\N	Technical Support	1234567885	nbmn mn mn	NORMAL	INVESTIGATING	\N	\N	\N	\N	\N	f	f	::1	Global	Google Chrome	Windows OS	en-US	UTC	2026-08-02 07:16:17.77	nbmn mn mn	Technical Support	NORMAL	0.05	Hello hello,\n\nThank you for reaching out to Dragon Studios Command Center regarding "1234567885".\n\nOur Technical Support engineering team has reviewed your inquiry. We are currently analyzing the specifications provided and will dispatch a comprehensive technical response shortly.\n\nIf you have additional attachments or context to provide, please reply directly to this thread or track your ticket status at our Support Center.\n\nBest regards,\nDragon Studios Support Team	1234567885	TECHNICAL_SUPPORT, URGENCY_NORMAL	Within 24 Hours	t	\N	2026-08-02 07:16:17.785	2026-08-02 07:56:47.952
cmsbkalow0000xstqv6tnhgp3	DRG-2026-000002	d8d7039add2c054e46ace2f937651bea	hello who are you	t93618211@gmail.com	\N	\N	Technical Support	hello	vdmmv zmds v	NORMAL	INVESTIGATING	\N	\N	\N	\N	\N	f	f	::1	Global	Google Chrome	Windows OS	en-US	UTC	2026-08-02 08:52:10.428	vdmmv zmds v	Technical Support	NORMAL	0.05	Hello hello who are you,\n\nThank you for reaching out to Dragon Studios Command Center regarding "hello".\n\nOur Technical Support engineering team has reviewed your inquiry. We are currently analyzing the specifications provided and will dispatch a comprehensive technical response shortly.\n\nIf you have additional attachments or context to provide, please reply directly to this thread or track your ticket status at our Support Center.\n\nBest regards,\nDragon Studios Support Team	hello, vdmmv	TECHNICAL_SUPPORT, URGENCY_NORMAL	Within 24 Hours	t	\N	2026-08-02 08:52:10.448	2026-08-02 08:53:34.549
\.


--
-- Data for Name: ContactVerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactVerificationToken" (id, token, email, name, company, phone, category, subject, message, priority, "ipAddress", country, browser, os, language, timezone, "expiresAt", used, "createdAt") FROM stdin;
\.


--
-- Data for Name: ContentBlock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContentBlock" (id, key, category, label, type, content, "draftContent", "isPublished", version, "updatedBy", "sectionId", "createdAt", "updatedAt") FROM stdin;
cmsbgezhw0002tqhwvs5q29ml	hero_headline	Homepage	Hero Main Headline	text	FORGING WORLDS BEYOND IMAGINATION	\N	t	1	Admin	\N	2026-08-02 07:03:36.5	2026-08-02 07:03:36.5
cmsbgezi00003tqhwhwr0icgo	hero_subheadline	Homepage	Hero Subheadline Description	textarea	We craft AAA interactive experiences that push the boundaries of real-time graphics and cinematic storytelling.	\N	t	1	Admin	\N	2026-08-02 07:03:36.504	2026-08-02 07:03:36.504
cmsbgezi10004tqhwv23mdsq2	announcement_banner	Global	Top Announcement Banner	text	🔥 PROJECT DRAGON REAL-TIME ALPHA EXPANSION LIVE NOW — JOIN COMMUNITY ACCESS	\N	t	1	Admin	\N	2026-08-02 07:03:36.506	2026-08-02 07:03:36.506
cmsbgezi30005tqhw6alt73xm	footer_tagline	Footer	Footer Studio Tagline	textarea	Dragon Studios is a premier game development powerhouse. Transporting players into uncharted digital dimensions.	\N	t	1	Admin	\N	2026-08-02 07:03:36.508	2026-08-02 07:03:36.508
\.


--
-- Data for Name: ContentRevision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContentRevision" (id, "pageId", "blockKey", version, content, "changedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, name, email, country, language, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CustomerNotification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomerNotification" (id, "profileId", title, message, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: CustomerPreference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomerPreference" (id, "profileId", "emailUpdateAlerts", "securityAlerts", "marketingEmails") FROM stdin;
\.


--
-- Data for Name: CustomerProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomerProfile" (id, email, name, avatar, language, timezone, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CustomerSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomerSession" (id, "profileId", "sessionToken", "ipAddress", "userAgent", "expiresAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: DLC; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DLC" (id, "gameId", name, description, price, status) FROM stdin;
\.


--
-- Data for Name: DashboardWidget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DashboardWidget" (id, title, type, "position", "createdAt") FROM stdin;
\.


--
-- Data for Name: DatabaseBackupRecord; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DatabaseBackupRecord" (id, filename, size, status, "storageUrl", "createdAt") FROM stdin;
\.


--
-- Data for Name: DeliveryLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DeliveryLog" (id, recipient, channel, status, "errorMessage", "createdAt") FROM stdin;
\.


--
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Department" (id, name, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: Deployment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Deployment" (id, version, environment, status, "deployedBy", "commitHash", "createdAt") FROM stdin;
\.


--
-- Data for Name: EmailCampaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailCampaign" (id, subject, content, "sentCount", status, "createdAt") FROM stdin;
\.


--
-- Data for Name: EmailConfiguration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailConfiguration" (id, "smtpHost", "smtpPort", username, "senderEmail", "senderName", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmailLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailLog" (id, "ticketId", recipient, subject, status, "errorMessage", "createdAt") FROM stdin;
cmsbibe1y0000tqg4dmhhjt0r	\N	whitedash99@gmail.com	RE: [DRG-2026-000001] 1234567885	DISPATCHED	\N	2026-08-02 07:56:47.975
cmsbkc8320000tqcg5p35089y	\N	t93618211@gmail.com	RE: [DRG-2026-000002] hello	DISPATCHED	\N	2026-08-02 08:53:26.126
cmsbkceli0002tqcg5zwq3dkq	\N	t93618211@gmail.com	RE: [DRG-2026-000002] hello	DISPATCHED	\N	2026-08-02 08:53:34.567
\.


--
-- Data for Name: ErrorLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ErrorLog" (id, message, stack, source, "userEmail", "createdAt") FROM stdin;
\.


--
-- Data for Name: FAQItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FAQItem" (id, question, answer, category, "order") FROM stdin;
\.


--
-- Data for Name: FeatureFlag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeatureFlag" (id, key, name, enabled, description, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Game" (id, slug, title, subtitle, genre, status, year, description, "fullDescription", palette, "accentColor", "glowColor", platforms, tags, featured, "heroImage", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: GameContent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GameContent" (id, slug, name, subtitle, genre, status, "releaseDate", developer, publisher, engine, platforms, description, "logoUrl", "bannerUrl", "heroVideoUrl", features, requirements, "isPublished", "createdAt", "updatedAt") FROM stdin;
cmsbfoese0004tq4ou2mmy212	hello	hello	\N	Action RPG	In Development	Q3 2027	Dragon Studios	Dragon Interactive	Dragon Engine v5.4	PC, PS5, Xbox Series X	An epic AAA experience forged by Dragon Studios.	\N	\N	\N	\N	\N	t	2026-08-02 06:42:56.606	2026-08-02 06:42:56.606
\.


--
-- Data for Name: GameFeature; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GameFeature" (id, "gameId", title, description, icon) FROM stdin;
\.


--
-- Data for Name: GameMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GameMedia" (id, "gameId", type, url, title, "createdAt") FROM stdin;
\.


--
-- Data for Name: GamePlatform; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GamePlatform" (id, "gameId", name, "storeUrl", "releaseDate") FROM stdin;
\.


--
-- Data for Name: HealthCheck; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."HealthCheck" (id, service, status, latency, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Integration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Integration" (id, name, provider, status, enabled, config, "updatedAt") FROM stdin;
\.


--
-- Data for Name: InternalNote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InternalNote" (id, "ticketId", author, note, "createdAt") FROM stdin;
\.


--
-- Data for Name: KnowledgeArticle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnowledgeArticle" (id, slug, title, category, tags, author, content, status, helpful, views, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: KnowledgeCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnowledgeCategory" (id, name, description, icon, "createdAt") FROM stdin;
\.


--
-- Data for Name: MarketingTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MarketingTemplate" (id, name, category, "htmlContent", "createdAt") FROM stdin;
\.


--
-- Data for Name: MediaAsset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaAsset" (id, name, size, type, "mimeType", category, url, "altText", dimensions, "folderId", "uploaderId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MediaCollection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaCollection" (id, name, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: MediaFolder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaFolder" (id, name, slug, path, "createdAt") FROM stdin;
\.


--
-- Data for Name: MediaTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaTag" (id, "assetId", name) FROM stdin;
\.


--
-- Data for Name: MediaUsage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaUsage" (id, "assetId", location, "createdAt") FROM stdin;
\.


--
-- Data for Name: Metric; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Metric" (id, name, value, unit, "updatedAt") FROM stdin;
\.


--
-- Data for Name: NavigationMenu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NavigationMenu" (id, name, items, "updatedBy", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NewsArticle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NewsArticle" (id, slug, title, excerpt, content, author, category, tags, "featuredImage", status, "publishedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NewsletterSubscriber; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NewsletterSubscriber" (id, email, "createdAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, title, message, type, recipient, "isRead", channel, "createdAt") FROM stdin;
\.


--
-- Data for Name: NotificationPreference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotificationPreference" (id, "userEmail", "emailAlert", "inAppAlert", "createdAt") FROM stdin;
\.


--
-- Data for Name: NotificationRule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotificationRule" (id, event, channel, active, "createdAt") FROM stdin;
\.


--
-- Data for Name: NotificationTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotificationTemplate" (id, name, subject, body, category, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OptimizationReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OptimizationReport" (id, title, summary, "createdAt") FROM stdin;
\.


--
-- Data for Name: Page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Page" (id, title, slug, status, author, category, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PageSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PageSection" (id, "pageId", title, "order", visible, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PatchNote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PatchNote" (id, "gameId", version, title, changes, "releasedAt") FROM stdin;
\.


--
-- Data for Name: PerformanceMetric; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PerformanceMetric" (id, name, value, unit, "createdAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, "roleId", action, resource, granted, "createdAt") FROM stdin;
\.


--
-- Data for Name: PressRelease; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PressRelease" (id, title, slug, excerpt, content, "releaseDate", "pdfUrl", "createdAt") FROM stdin;
\.


--
-- Data for Name: ProductionEnvironment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductionEnvironment" (id, name, domain, status, "updatedAt") FROM stdin;
\.


--
-- Data for Name: Promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Promotion" (id, code, discount, "usageLimit", "usageCount", status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description, "isCustom", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SEOData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SEOData" (id, "pageId", "metaTitle", "metaDescription", keywords, "ogImage", "canonicalUrl", robots, "structuredData", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ScheduledJob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ScheduledJob" (id, name, cron, status, "lastRunAt") FROM stdin;
\.


--
-- Data for Name: SecurityAlert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SecurityAlert" (id, title, severity, status, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: SecurityEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SecurityEvent" (id, "eventType", severity, "userEmail", "ipAddress", details, "createdAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "userId", "sessionToken", "ipAddress", "userAgent", "expiresAt", "createdAt") FROM stdin;
cmsbfkm210001tq4ofdbpae3c	cmsbf9t6t0000tqgkeq9a26fr	session_b9z3s1zs3c_1785652799398	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-08-09 06:39:59.398	2026-08-02 06:39:59.402
\.


--
-- Data for Name: StorageConfiguration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StorageConfiguration" (id, provider, "bucketName", region, "updatedAt") FROM stdin;
\.


--
-- Data for Name: SystemHealthCheck; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemHealthCheck" (id, endpoint, status, "httpStatus", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SystemLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemLog" (id, level, message, "createdAt") FROM stdin;
\.


--
-- Data for Name: SystemResource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemResource" (id, "nodeId", "cpuUsage", "memoryUsage", "diskUsage", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SystemSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemSetting" (id, key, value, category, description, "updatedBy", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamMember" (id, "departmentId", name, email, role, active, "createdAt") FROM stdin;
\.


--
-- Data for Name: TestResult; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TestResult" (id, "testName", category, status, duration, details, "createdAt") FROM stdin;
\.


--
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ticket" (id, "ticketId", "customerId", "customerName", "customerEmail", category, subject, description, priority, status, "assignedAgent", department, tags, "lastReplyAt", "closedAt", "createdAt", "updatedAt", "tenantId", "createdByType", source, "legacyContactTicketId", "migrationDate", "deletedAt", deleted) FROM stdin;
cmsbgvawp00004gtqj16j86b3	DRG-2026-000001	\N	hello	whitedash99@gmail.com	Technical Support	1234567885	nbmn mn mn	NORMAL	INVESTIGATING	\N	Support	Inbound	2026-08-02 16:58:15.633	\N	2026-08-02 07:16:17.785	2026-08-02 07:56:47.952	dragon_studios	CUSTOMER	PUBLIC_FORM	cmsbgvawp00004gtqj16j86b3	2026-08-02 16:58:15.632826	\N	f
cmsbkalow0000xstqv6tnhgp3	DRG-2026-000002	\N	hello who are you	t93618211@gmail.com	Technical Support	hello	vdmmv zmds v	NORMAL	INVESTIGATING	\N	Support	Inbound	2026-08-02 16:58:15.633	\N	2026-08-02 08:52:10.448	2026-08-02 08:53:34.549	dragon_studios	CUSTOMER	PUBLIC_FORM	cmsbkalow0000xstqv6tnhgp3	2026-08-02 16:58:15.632826	\N	f
\.


--
-- Data for Name: TicketActivity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TicketActivity" (id, "ticketId", action, details, performer, "createdAt") FROM stdin;
\.


--
-- Data for Name: TicketAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TicketAttachment" (id, "ticketId", "fileName", "fileSize", "fileType", url, "createdAt") FROM stdin;
\.


--
-- Data for Name: TicketMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TicketMessage" (id, "ticketId", "senderType", "senderName", "senderEmail", message, "createdAt", sender, "contactTicketId") FROM stdin;
\.


--
-- Data for Name: UploadHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UploadHistory" (id, "fileName", "fileSize", status, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, department, status, avatar, "mfaEnabled", "createdAt", "updatedAt", "emailVerified", image) FROM stdin;
cmsbf9t6t0000tqgkeq9a26fr	Dragon Owner	owner@dragonstudios.com	$2a$10$6LSuWyp3xqHsaYeH2MtqfezagLlbGNQLHTXjGgU55IlPPaIO3C7Q6	OWNER	Executive Leadership	ACTIVE	\N	f	2026-08-02 06:31:35.429	2026-08-02 07:03:36.382	\N	\N
cmsbgezht0001tqhwvdue5nvd	Dragon System Admin	admin@dragonstudios.com	$2a$10$Gw7nKK9folhyY6YalV1QbufckQ5Ue86CG96rgp1yve6kjRZ3zSg3K	ADMINISTRATOR	Engineering	ACTIVE	\N	f	2026-08-02 07:03:36.497	2026-08-02 07:03:36.497	\N	\N
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: Visitor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Visitor" (id, "ipAddress", country, language, device, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Webhook; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Webhook" (id, name, url, events, "secretKey", status, "createdAt") FROM stdin;
\.


--
-- Data for Name: WebhookEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WebhookEvent" (id, event, payload, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: Workflow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Workflow" (id, name, description, status, category, "triggerType", "actionType", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WorkflowAction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkflowAction" (id, "workflowId", "actionType", config, "createdAt") FROM stdin;
\.


--
-- Data for Name: WorkflowCondition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkflowCondition" (id, "workflowId", operator, field, comparison, value, "createdAt") FROM stdin;
\.


--
-- Data for Name: WorkflowExecution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkflowExecution" (id, "workflowId", status, duration, error, "createdAt") FROM stdin;
\.


--
-- Data for Name: WorkflowTrigger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkflowTrigger" (id, "workflowId", "eventType", payload, "createdAt") FROM stdin;
\.


--
-- Name: AIActivity AIActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIActivity"
    ADD CONSTRAINT "AIActivity_pkey" PRIMARY KEY (id);


--
-- Name: AIAnalysis AIAnalysis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIAnalysis"
    ADD CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY (id);


--
-- Name: AIConfiguration AIConfiguration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIConfiguration"
    ADD CONSTRAINT "AIConfiguration_pkey" PRIMARY KEY (id);


--
-- Name: AIConversation AIConversation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIConversation"
    ADD CONSTRAINT "AIConversation_pkey" PRIMARY KEY (id);


--
-- Name: AIFeedback AIFeedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIFeedback"
    ADD CONSTRAINT "AIFeedback_pkey" PRIMARY KEY (id);


--
-- Name: AIHelpConversation AIHelpConversation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIHelpConversation"
    ADD CONSTRAINT "AIHelpConversation_pkey" PRIMARY KEY (id);


--
-- Name: AIHelpMessage AIHelpMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIHelpMessage"
    ADD CONSTRAINT "AIHelpMessage_pkey" PRIMARY KEY (id);


--
-- Name: AIKnowledge AIKnowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIKnowledge"
    ADD CONSTRAINT "AIKnowledge_pkey" PRIMARY KEY (id);


--
-- Name: AIMessage AIMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIMessage"
    ADD CONSTRAINT "AIMessage_pkey" PRIMARY KEY (id);


--
-- Name: AIPrompt AIPrompt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIPrompt"
    ADD CONSTRAINT "AIPrompt_pkey" PRIMARY KEY (id);


--
-- Name: AISearchLog AISearchLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AISearchLog"
    ADD CONSTRAINT "AISearchLog_pkey" PRIMARY KEY (id);


--
-- Name: AISetting AISetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AISetting"
    ADD CONSTRAINT "AISetting_pkey" PRIMARY KEY (id);


--
-- Name: AIUsage AIUsage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIUsage"
    ADD CONSTRAINT "AIUsage_pkey" PRIMARY KEY (id);


--
-- Name: APIApplication APIApplication_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APIApplication"
    ADD CONSTRAINT "APIApplication_pkey" PRIMARY KEY (id);


--
-- Name: APIEndpoint APIEndpoint_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APIEndpoint"
    ADD CONSTRAINT "APIEndpoint_pkey" PRIMARY KEY (id);


--
-- Name: APIKey APIKey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APIKey"
    ADD CONSTRAINT "APIKey_pkey" PRIMARY KEY (id);


--
-- Name: APILog APILog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APILog"
    ADD CONSTRAINT "APILog_pkey" PRIMARY KEY (id);


--
-- Name: APIUsageRecord APIUsageRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APIUsageRecord"
    ADD CONSTRAINT "APIUsageRecord_pkey" PRIMARY KEY (id);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: AnalyticsEvent AnalyticsEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnalyticsEvent"
    ADD CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY (id);


--
-- Name: AnalyticsReport AnalyticsReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnalyticsReport"
    ADD CONSTRAINT "AnalyticsReport_pkey" PRIMARY KEY (id);


--
-- Name: AnalyticsSession AnalyticsSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnalyticsSession"
    ADD CONSTRAINT "AnalyticsSession_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: AudienceSegment AudienceSegment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AudienceSegment"
    ADD CONSTRAINT "AudienceSegment_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: AutomationLog AutomationLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AutomationLog"
    ADD CONSTRAINT "AutomationLog_pkey" PRIMARY KEY (id);


--
-- Name: BackupRecord BackupRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BackupRecord"
    ADD CONSTRAINT "BackupRecord_pkey" PRIMARY KEY (id);


--
-- Name: BuildHistory BuildHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BuildHistory"
    ADD CONSTRAINT "BuildHistory_pkey" PRIMARY KEY (id);


--
-- Name: CacheRecord CacheRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CacheRecord"
    ADD CONSTRAINT "CacheRecord_pkey" PRIMARY KEY (id);


--
-- Name: CampaignAnalyticsRecord CampaignAnalyticsRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CampaignAnalyticsRecord"
    ADD CONSTRAINT "CampaignAnalyticsRecord_pkey" PRIMARY KEY (id);


--
-- Name: Campaign Campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaign"
    ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY (id);


--
-- Name: Career Career_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Career"
    ADD CONSTRAINT "Career_pkey" PRIMARY KEY (id);


--
-- Name: CloudDeployment CloudDeployment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CloudDeployment"
    ADD CONSTRAINT "CloudDeployment_pkey" PRIMARY KEY (id);


--
-- Name: CommunityEvent CommunityEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommunityEvent"
    ADD CONSTRAINT "CommunityEvent_pkey" PRIMARY KEY (id);


--
-- Name: ContactTicket ContactTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactTicket"
    ADD CONSTRAINT "ContactTicket_pkey" PRIMARY KEY (id);


--
-- Name: ContactVerificationToken ContactVerificationToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactVerificationToken"
    ADD CONSTRAINT "ContactVerificationToken_pkey" PRIMARY KEY (id);


--
-- Name: ContentBlock ContentBlock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentBlock"
    ADD CONSTRAINT "ContentBlock_pkey" PRIMARY KEY (id);


--
-- Name: ContentRevision ContentRevision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentRevision"
    ADD CONSTRAINT "ContentRevision_pkey" PRIMARY KEY (id);


--
-- Name: CustomerNotification CustomerNotification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerNotification"
    ADD CONSTRAINT "CustomerNotification_pkey" PRIMARY KEY (id);


--
-- Name: CustomerPreference CustomerPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerPreference"
    ADD CONSTRAINT "CustomerPreference_pkey" PRIMARY KEY (id);


--
-- Name: CustomerProfile CustomerProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerProfile"
    ADD CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY (id);


--
-- Name: CustomerSession CustomerSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerSession"
    ADD CONSTRAINT "CustomerSession_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: DLC DLC_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DLC"
    ADD CONSTRAINT "DLC_pkey" PRIMARY KEY (id);


--
-- Name: DashboardWidget DashboardWidget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DashboardWidget"
    ADD CONSTRAINT "DashboardWidget_pkey" PRIMARY KEY (id);


--
-- Name: DatabaseBackupRecord DatabaseBackupRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DatabaseBackupRecord"
    ADD CONSTRAINT "DatabaseBackupRecord_pkey" PRIMARY KEY (id);


--
-- Name: DeliveryLog DeliveryLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeliveryLog"
    ADD CONSTRAINT "DeliveryLog_pkey" PRIMARY KEY (id);


--
-- Name: Department Department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);


--
-- Name: Deployment Deployment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Deployment"
    ADD CONSTRAINT "Deployment_pkey" PRIMARY KEY (id);


--
-- Name: EmailCampaign EmailCampaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailCampaign"
    ADD CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY (id);


--
-- Name: EmailConfiguration EmailConfiguration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailConfiguration"
    ADD CONSTRAINT "EmailConfiguration_pkey" PRIMARY KEY (id);


--
-- Name: EmailLog EmailLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailLog"
    ADD CONSTRAINT "EmailLog_pkey" PRIMARY KEY (id);


--
-- Name: ErrorLog ErrorLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ErrorLog"
    ADD CONSTRAINT "ErrorLog_pkey" PRIMARY KEY (id);


--
-- Name: FAQItem FAQItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FAQItem"
    ADD CONSTRAINT "FAQItem_pkey" PRIMARY KEY (id);


--
-- Name: FeatureFlag FeatureFlag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeatureFlag"
    ADD CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY (id);


--
-- Name: GameContent GameContent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GameContent"
    ADD CONSTRAINT "GameContent_pkey" PRIMARY KEY (id);


--
-- Name: GameFeature GameFeature_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GameFeature"
    ADD CONSTRAINT "GameFeature_pkey" PRIMARY KEY (id);


--
-- Name: GameMedia GameMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GameMedia"
    ADD CONSTRAINT "GameMedia_pkey" PRIMARY KEY (id);


--
-- Name: GamePlatform GamePlatform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GamePlatform"
    ADD CONSTRAINT "GamePlatform_pkey" PRIMARY KEY (id);


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: HealthCheck HealthCheck_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HealthCheck"
    ADD CONSTRAINT "HealthCheck_pkey" PRIMARY KEY (id);


--
-- Name: Integration Integration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Integration"
    ADD CONSTRAINT "Integration_pkey" PRIMARY KEY (id);


--
-- Name: InternalNote InternalNote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InternalNote"
    ADD CONSTRAINT "InternalNote_pkey" PRIMARY KEY (id);


--
-- Name: KnowledgeArticle KnowledgeArticle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnowledgeArticle"
    ADD CONSTRAINT "KnowledgeArticle_pkey" PRIMARY KEY (id);


--
-- Name: KnowledgeCategory KnowledgeCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnowledgeCategory"
    ADD CONSTRAINT "KnowledgeCategory_pkey" PRIMARY KEY (id);


--
-- Name: MarketingTemplate MarketingTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MarketingTemplate"
    ADD CONSTRAINT "MarketingTemplate_pkey" PRIMARY KEY (id);


--
-- Name: MediaAsset MediaAsset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaAsset"
    ADD CONSTRAINT "MediaAsset_pkey" PRIMARY KEY (id);


--
-- Name: MediaCollection MediaCollection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaCollection"
    ADD CONSTRAINT "MediaCollection_pkey" PRIMARY KEY (id);


--
-- Name: MediaFolder MediaFolder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaFolder"
    ADD CONSTRAINT "MediaFolder_pkey" PRIMARY KEY (id);


--
-- Name: MediaTag MediaTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaTag"
    ADD CONSTRAINT "MediaTag_pkey" PRIMARY KEY (id);


--
-- Name: MediaUsage MediaUsage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaUsage"
    ADD CONSTRAINT "MediaUsage_pkey" PRIMARY KEY (id);


--
-- Name: Metric Metric_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Metric"
    ADD CONSTRAINT "Metric_pkey" PRIMARY KEY (id);


--
-- Name: NavigationMenu NavigationMenu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NavigationMenu"
    ADD CONSTRAINT "NavigationMenu_pkey" PRIMARY KEY (id);


--
-- Name: NewsArticle NewsArticle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsArticle"
    ADD CONSTRAINT "NewsArticle_pkey" PRIMARY KEY (id);


--
-- Name: NewsletterSubscriber NewsletterSubscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterSubscriber"
    ADD CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY (id);


--
-- Name: NotificationPreference NotificationPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationPreference"
    ADD CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY (id);


--
-- Name: NotificationRule NotificationRule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationRule"
    ADD CONSTRAINT "NotificationRule_pkey" PRIMARY KEY (id);


--
-- Name: NotificationTemplate NotificationTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationTemplate"
    ADD CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OptimizationReport OptimizationReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OptimizationReport"
    ADD CONSTRAINT "OptimizationReport_pkey" PRIMARY KEY (id);


--
-- Name: PageSection PageSection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_pkey" PRIMARY KEY (id);


--
-- Name: Page Page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY (id);


--
-- Name: PatchNote PatchNote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatchNote"
    ADD CONSTRAINT "PatchNote_pkey" PRIMARY KEY (id);


--
-- Name: PerformanceMetric PerformanceMetric_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PerformanceMetric"
    ADD CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PressRelease PressRelease_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PressRelease"
    ADD CONSTRAINT "PressRelease_pkey" PRIMARY KEY (id);


--
-- Name: ProductionEnvironment ProductionEnvironment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductionEnvironment"
    ADD CONSTRAINT "ProductionEnvironment_pkey" PRIMARY KEY (id);


--
-- Name: Promotion Promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SEOData SEOData_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SEOData"
    ADD CONSTRAINT "SEOData_pkey" PRIMARY KEY (id);


--
-- Name: ScheduledJob ScheduledJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ScheduledJob"
    ADD CONSTRAINT "ScheduledJob_pkey" PRIMARY KEY (id);


--
-- Name: SecurityAlert SecurityAlert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SecurityAlert"
    ADD CONSTRAINT "SecurityAlert_pkey" PRIMARY KEY (id);


--
-- Name: SecurityEvent SecurityEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SecurityEvent"
    ADD CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: StorageConfiguration StorageConfiguration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StorageConfiguration"
    ADD CONSTRAINT "StorageConfiguration_pkey" PRIMARY KEY (id);


--
-- Name: SystemHealthCheck SystemHealthCheck_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemHealthCheck"
    ADD CONSTRAINT "SystemHealthCheck_pkey" PRIMARY KEY (id);


--
-- Name: SystemLog SystemLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemLog"
    ADD CONSTRAINT "SystemLog_pkey" PRIMARY KEY (id);


--
-- Name: SystemResource SystemResource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemResource"
    ADD CONSTRAINT "SystemResource_pkey" PRIMARY KEY (id);


--
-- Name: SystemSetting SystemSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemSetting"
    ADD CONSTRAINT "SystemSetting_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: TestResult TestResult_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TestResult"
    ADD CONSTRAINT "TestResult_pkey" PRIMARY KEY (id);


--
-- Name: TicketActivity TicketActivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketActivity"
    ADD CONSTRAINT "TicketActivity_pkey" PRIMARY KEY (id);


--
-- Name: TicketAttachment TicketAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketAttachment"
    ADD CONSTRAINT "TicketAttachment_pkey" PRIMARY KEY (id);


--
-- Name: TicketMessage TicketMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_pkey" PRIMARY KEY (id);


--
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY (id);


--
-- Name: UploadHistory UploadHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UploadHistory"
    ADD CONSTRAINT "UploadHistory_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Visitor Visitor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Visitor"
    ADD CONSTRAINT "Visitor_pkey" PRIMARY KEY (id);


--
-- Name: WebhookEvent WebhookEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WebhookEvent"
    ADD CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY (id);


--
-- Name: Webhook Webhook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Webhook"
    ADD CONSTRAINT "Webhook_pkey" PRIMARY KEY (id);


--
-- Name: WorkflowAction WorkflowAction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowAction"
    ADD CONSTRAINT "WorkflowAction_pkey" PRIMARY KEY (id);


--
-- Name: WorkflowCondition WorkflowCondition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowCondition"
    ADD CONSTRAINT "WorkflowCondition_pkey" PRIMARY KEY (id);


--
-- Name: WorkflowExecution WorkflowExecution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowExecution"
    ADD CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY (id);


--
-- Name: WorkflowTrigger WorkflowTrigger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowTrigger"
    ADD CONSTRAINT "WorkflowTrigger_pkey" PRIMARY KEY (id);


--
-- Name: Workflow Workflow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Workflow"
    ADD CONSTRAINT "Workflow_pkey" PRIMARY KEY (id);


--
-- Name: AIAnalysis_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIAnalysis_ticketId_idx" ON public."AIAnalysis" USING btree ("ticketId");


--
-- Name: AIConversation_userEmail_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIConversation_userEmail_idx" ON public."AIConversation" USING btree ("userEmail");


--
-- Name: AIFeedback_conversationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIFeedback_conversationId_idx" ON public."AIFeedback" USING btree ("conversationId");


--
-- Name: AIHelpConversation_customerEmail_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIHelpConversation_customerEmail_idx" ON public."AIHelpConversation" USING btree ("customerEmail");


--
-- Name: AIHelpMessage_conversationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIHelpMessage_conversationId_idx" ON public."AIHelpMessage" USING btree ("conversationId");


--
-- Name: AIKnowledge_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIKnowledge_category_idx" ON public."AIKnowledge" USING btree (category);


--
-- Name: AIKnowledge_topic_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AIKnowledge_topic_key" ON public."AIKnowledge" USING btree (topic);


--
-- Name: AIMessage_conversationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIMessage_conversationId_idx" ON public."AIMessage" USING btree ("conversationId");


--
-- Name: AIPrompt_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIPrompt_category_idx" ON public."AIPrompt" USING btree (category);


--
-- Name: AIPrompt_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIPrompt_key_idx" ON public."AIPrompt" USING btree (key);


--
-- Name: AIPrompt_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AIPrompt_key_key" ON public."AIPrompt" USING btree (key);


--
-- Name: AISearchLog_query_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AISearchLog_query_idx" ON public."AISearchLog" USING btree (query);


--
-- Name: AISetting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AISetting_key_key" ON public."AISetting" USING btree (key);


--
-- Name: AIUsage_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIUsage_createdAt_idx" ON public."AIUsage" USING btree ("createdAt");


--
-- Name: AIUsage_feature_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIUsage_feature_idx" ON public."AIUsage" USING btree (feature);


--
-- Name: APIApplication_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "APIApplication_name_key" ON public."APIApplication" USING btree (name);


--
-- Name: APIEndpoint_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "APIEndpoint_url_key" ON public."APIEndpoint" USING btree (url);


--
-- Name: APIKey_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "APIKey_name_idx" ON public."APIKey" USING btree (name);


--
-- Name: APILog_endpoint_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "APILog_endpoint_idx" ON public."APILog" USING btree (endpoint);


--
-- Name: APILog_statusCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "APILog_statusCode_idx" ON public."APILog" USING btree ("statusCode");


--
-- Name: APIUsageRecord_appName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "APIUsageRecord_appName_idx" ON public."APIUsageRecord" USING btree ("appName");


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Account_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Account_userId_idx" ON public."Account" USING btree ("userId");


--
-- Name: AnalyticsEvent_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnalyticsEvent_createdAt_idx" ON public."AnalyticsEvent" USING btree ("createdAt");


--
-- Name: AnalyticsEvent_event_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AnalyticsEvent_event_idx" ON public."AnalyticsEvent" USING btree (event);


--
-- Name: AnalyticsSession_sessionKey_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AnalyticsSession_sessionKey_key" ON public."AnalyticsSession" USING btree ("sessionKey");


--
-- Name: Article_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_featured_idx" ON public."Article" USING btree (featured);


--
-- Name: Article_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Article_slug_idx" ON public."Article" USING btree (slug);


--
-- Name: Article_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Article_slug_key" ON public."Article" USING btree (slug);


--
-- Name: AudienceSegment_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AudienceSegment_name_key" ON public."AudienceSegment" USING btree (name);


--
-- Name: AuditLog_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_action_idx" ON public."AuditLog" USING btree (action);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_userEmail_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_userEmail_idx" ON public."AuditLog" USING btree ("userEmail");


--
-- Name: AutomationLog_workflow_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AutomationLog_workflow_idx" ON public."AutomationLog" USING btree (workflow);


--
-- Name: CacheRecord_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CacheRecord_key_key" ON public."CacheRecord" USING btree (key);


--
-- Name: CampaignAnalyticsRecord_campaignId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CampaignAnalyticsRecord_campaignId_idx" ON public."CampaignAnalyticsRecord" USING btree ("campaignId");


--
-- Name: Campaign_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Campaign_name_key" ON public."Campaign" USING btree (name);


--
-- Name: Campaign_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Campaign_status_idx" ON public."Campaign" USING btree (status);


--
-- Name: Campaign_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Campaign_type_idx" ON public."Campaign" USING btree (type);


--
-- Name: Career_department_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Career_department_idx" ON public."Career" USING btree (department);


--
-- Name: Career_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Career_status_idx" ON public."Career" USING btree (status);


--
-- Name: CommunityEvent_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CommunityEvent_slug_key" ON public."CommunityEvent" USING btree (slug);


--
-- Name: ContactTicket_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactTicket_category_idx" ON public."ContactTicket" USING btree (category);


--
-- Name: ContactTicket_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactTicket_createdAt_idx" ON public."ContactTicket" USING btree ("createdAt");


--
-- Name: ContactTicket_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactTicket_email_idx" ON public."ContactTicket" USING btree (email);


--
-- Name: ContactTicket_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactTicket_status_idx" ON public."ContactTicket" USING btree (status);


--
-- Name: ContactTicket_ticketId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ContactTicket_ticketId_key" ON public."ContactTicket" USING btree ("ticketId");


--
-- Name: ContactTicket_trackingToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactTicket_trackingToken_idx" ON public."ContactTicket" USING btree ("trackingToken");


--
-- Name: ContactVerificationToken_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactVerificationToken_email_idx" ON public."ContactVerificationToken" USING btree (email);


--
-- Name: ContactVerificationToken_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactVerificationToken_token_idx" ON public."ContactVerificationToken" USING btree (token);


--
-- Name: ContactVerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ContactVerificationToken_token_key" ON public."ContactVerificationToken" USING btree (token);


--
-- Name: ContentBlock_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContentBlock_category_idx" ON public."ContentBlock" USING btree (category);


--
-- Name: ContentBlock_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContentBlock_key_idx" ON public."ContentBlock" USING btree (key);


--
-- Name: ContentBlock_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ContentBlock_key_key" ON public."ContentBlock" USING btree (key);


--
-- Name: ContentRevision_blockKey_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContentRevision_blockKey_idx" ON public."ContentRevision" USING btree ("blockKey");


--
-- Name: ContentRevision_pageId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContentRevision_pageId_idx" ON public."ContentRevision" USING btree ("pageId");


--
-- Name: CustomerNotification_profileId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomerNotification_profileId_idx" ON public."CustomerNotification" USING btree ("profileId");


--
-- Name: CustomerPreference_profileId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CustomerPreference_profileId_key" ON public."CustomerPreference" USING btree ("profileId");


--
-- Name: CustomerProfile_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomerProfile_email_idx" ON public."CustomerProfile" USING btree (email);


--
-- Name: CustomerProfile_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CustomerProfile_email_key" ON public."CustomerProfile" USING btree (email);


--
-- Name: CustomerSession_profileId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomerSession_profileId_idx" ON public."CustomerSession" USING btree ("profileId");


--
-- Name: CustomerSession_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CustomerSession_sessionToken_key" ON public."CustomerSession" USING btree ("sessionToken");


--
-- Name: Customer_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_email_idx" ON public."Customer" USING btree (email);


--
-- Name: Customer_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_email_key" ON public."Customer" USING btree (email);


--
-- Name: DLC_gameId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DLC_gameId_idx" ON public."DLC" USING btree ("gameId");


--
-- Name: DeliveryLog_recipient_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DeliveryLog_recipient_idx" ON public."DeliveryLog" USING btree (recipient);


--
-- Name: Department_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Department_name_key" ON public."Department" USING btree (name);


--
-- Name: EmailLog_recipient_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EmailLog_recipient_idx" ON public."EmailLog" USING btree (recipient);


--
-- Name: ErrorLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ErrorLog_createdAt_idx" ON public."ErrorLog" USING btree ("createdAt");


--
-- Name: ErrorLog_source_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ErrorLog_source_idx" ON public."ErrorLog" USING btree (source);


--
-- Name: FeatureFlag_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FeatureFlag_key_idx" ON public."FeatureFlag" USING btree (key);


--
-- Name: FeatureFlag_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FeatureFlag_key_key" ON public."FeatureFlag" USING btree (key);


--
-- Name: GameContent_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GameContent_slug_idx" ON public."GameContent" USING btree (slug);


--
-- Name: GameContent_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "GameContent_slug_key" ON public."GameContent" USING btree (slug);


--
-- Name: GameContent_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GameContent_status_idx" ON public."GameContent" USING btree (status);


--
-- Name: GameFeature_gameId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GameFeature_gameId_idx" ON public."GameFeature" USING btree ("gameId");


--
-- Name: GameMedia_gameId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GameMedia_gameId_idx" ON public."GameMedia" USING btree ("gameId");


--
-- Name: GamePlatform_gameId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "GamePlatform_gameId_idx" ON public."GamePlatform" USING btree ("gameId");


--
-- Name: Game_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Game_slug_idx" ON public."Game" USING btree (slug);


--
-- Name: Game_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Game_slug_key" ON public."Game" USING btree (slug);


--
-- Name: Game_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Game_status_idx" ON public."Game" USING btree (status);


--
-- Name: HealthCheck_service_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "HealthCheck_service_key" ON public."HealthCheck" USING btree (service);


--
-- Name: Integration_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Integration_name_key" ON public."Integration" USING btree (name);


--
-- Name: Integration_provider_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Integration_provider_idx" ON public."Integration" USING btree (provider);


--
-- Name: InternalNote_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InternalNote_ticketId_idx" ON public."InternalNote" USING btree ("ticketId");


--
-- Name: KnowledgeArticle_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "KnowledgeArticle_category_idx" ON public."KnowledgeArticle" USING btree (category);


--
-- Name: KnowledgeArticle_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "KnowledgeArticle_slug_idx" ON public."KnowledgeArticle" USING btree (slug);


--
-- Name: KnowledgeArticle_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "KnowledgeArticle_slug_key" ON public."KnowledgeArticle" USING btree (slug);


--
-- Name: KnowledgeArticle_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "KnowledgeArticle_status_idx" ON public."KnowledgeArticle" USING btree (status);


--
-- Name: KnowledgeCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "KnowledgeCategory_name_key" ON public."KnowledgeCategory" USING btree (name);


--
-- Name: MarketingTemplate_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MarketingTemplate_name_key" ON public."MarketingTemplate" USING btree (name);


--
-- Name: MediaAsset_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MediaAsset_category_idx" ON public."MediaAsset" USING btree (category);


--
-- Name: MediaAsset_folderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MediaAsset_folderId_idx" ON public."MediaAsset" USING btree ("folderId");


--
-- Name: MediaAsset_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MediaAsset_name_idx" ON public."MediaAsset" USING btree (name);


--
-- Name: MediaCollection_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MediaCollection_name_key" ON public."MediaCollection" USING btree (name);


--
-- Name: MediaFolder_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MediaFolder_name_key" ON public."MediaFolder" USING btree (name);


--
-- Name: MediaFolder_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MediaFolder_slug_key" ON public."MediaFolder" USING btree (slug);


--
-- Name: MediaTag_assetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MediaTag_assetId_idx" ON public."MediaTag" USING btree ("assetId");


--
-- Name: MediaUsage_assetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MediaUsage_assetId_idx" ON public."MediaUsage" USING btree ("assetId");


--
-- Name: Metric_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Metric_name_key" ON public."Metric" USING btree (name);


--
-- Name: NavigationMenu_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NavigationMenu_name_key" ON public."NavigationMenu" USING btree (name);


--
-- Name: NewsArticle_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NewsArticle_slug_idx" ON public."NewsArticle" USING btree (slug);


--
-- Name: NewsArticle_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NewsArticle_slug_key" ON public."NewsArticle" USING btree (slug);


--
-- Name: NewsArticle_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NewsArticle_status_idx" ON public."NewsArticle" USING btree (status);


--
-- Name: NewsletterSubscriber_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "NewsletterSubscriber_email_idx" ON public."NewsletterSubscriber" USING btree (email);


--
-- Name: NewsletterSubscriber_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON public."NewsletterSubscriber" USING btree (email);


--
-- Name: NotificationPreference_userEmail_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NotificationPreference_userEmail_key" ON public."NotificationPreference" USING btree ("userEmail");


--
-- Name: NotificationTemplate_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NotificationTemplate_name_key" ON public."NotificationTemplate" USING btree (name);


--
-- Name: Notification_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_isRead_idx" ON public."Notification" USING btree ("isRead");


--
-- Name: Notification_recipient_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_recipient_idx" ON public."Notification" USING btree (recipient);


--
-- Name: PageSection_pageId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PageSection_pageId_idx" ON public."PageSection" USING btree ("pageId");


--
-- Name: Page_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Page_slug_idx" ON public."Page" USING btree (slug);


--
-- Name: Page_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Page_slug_key" ON public."Page" USING btree (slug);


--
-- Name: Page_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Page_status_idx" ON public."Page" USING btree (status);


--
-- Name: PatchNote_gameId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PatchNote_gameId_idx" ON public."PatchNote" USING btree ("gameId");


--
-- Name: PerformanceMetric_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PerformanceMetric_name_idx" ON public."PerformanceMetric" USING btree (name);


--
-- Name: Permission_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_roleId_idx" ON public."Permission" USING btree ("roleId");


--
-- Name: PressRelease_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PressRelease_slug_key" ON public."PressRelease" USING btree (slug);


--
-- Name: ProductionEnvironment_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductionEnvironment_name_key" ON public."ProductionEnvironment" USING btree (name);


--
-- Name: Promotion_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Promotion_code_key" ON public."Promotion" USING btree (code);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: SEOData_pageId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SEOData_pageId_key" ON public."SEOData" USING btree ("pageId");


--
-- Name: ScheduledJob_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ScheduledJob_name_key" ON public."ScheduledJob" USING btree (name);


--
-- Name: SecurityAlert_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SecurityAlert_status_idx" ON public."SecurityAlert" USING btree (status);


--
-- Name: SecurityEvent_eventType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SecurityEvent_eventType_idx" ON public."SecurityEvent" USING btree ("eventType");


--
-- Name: SecurityEvent_severity_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SecurityEvent_severity_idx" ON public."SecurityEvent" USING btree (severity);


--
-- Name: Session_sessionToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_sessionToken_idx" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: SystemHealthCheck_endpoint_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SystemHealthCheck_endpoint_key" ON public."SystemHealthCheck" USING btree (endpoint);


--
-- Name: SystemLog_level_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SystemLog_level_idx" ON public."SystemLog" USING btree (level);


--
-- Name: SystemSetting_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SystemSetting_category_idx" ON public."SystemSetting" USING btree (category);


--
-- Name: SystemSetting_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SystemSetting_key_idx" ON public."SystemSetting" USING btree (key);


--
-- Name: SystemSetting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SystemSetting_key_key" ON public."SystemSetting" USING btree (key);


--
-- Name: TeamMember_departmentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TeamMember_departmentId_idx" ON public."TeamMember" USING btree ("departmentId");


--
-- Name: TeamMember_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TeamMember_email_key" ON public."TeamMember" USING btree (email);


--
-- Name: TestResult_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TestResult_category_idx" ON public."TestResult" USING btree (category);


--
-- Name: TestResult_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TestResult_status_idx" ON public."TestResult" USING btree (status);


--
-- Name: TicketActivity_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TicketActivity_ticketId_idx" ON public."TicketActivity" USING btree ("ticketId");


--
-- Name: TicketAttachment_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TicketAttachment_ticketId_idx" ON public."TicketAttachment" USING btree ("ticketId");


--
-- Name: TicketMessage_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TicketMessage_ticketId_idx" ON public."TicketMessage" USING btree ("ticketId");


--
-- Name: Ticket_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_category_idx" ON public."Ticket" USING btree (category);


--
-- Name: Ticket_createdByType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_createdByType_idx" ON public."Ticket" USING btree ("createdByType");


--
-- Name: Ticket_customerEmail_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_customerEmail_idx" ON public."Ticket" USING btree ("customerEmail");


--
-- Name: Ticket_legacyContactTicketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_legacyContactTicketId_idx" ON public."Ticket" USING btree ("legacyContactTicketId");


--
-- Name: Ticket_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_priority_idx" ON public."Ticket" USING btree (priority);


--
-- Name: Ticket_source_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_source_idx" ON public."Ticket" USING btree (source);


--
-- Name: Ticket_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_status_idx" ON public."Ticket" USING btree (status);


--
-- Name: Ticket_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_tenantId_idx" ON public."Ticket" USING btree ("tenantId");


--
-- Name: Ticket_ticketId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ticket_ticketId_idx" ON public."Ticket" USING btree ("ticketId");


--
-- Name: Ticket_ticketId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Ticket_ticketId_key" ON public."Ticket" USING btree ("ticketId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Visitor_ipAddress_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Visitor_ipAddress_key" ON public."Visitor" USING btree ("ipAddress");


--
-- Name: WebhookEvent_event_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WebhookEvent_event_idx" ON public."WebhookEvent" USING btree (event);


--
-- Name: Webhook_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Webhook_url_key" ON public."Webhook" USING btree (url);


--
-- Name: WorkflowAction_workflowId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkflowAction_workflowId_idx" ON public."WorkflowAction" USING btree ("workflowId");


--
-- Name: WorkflowCondition_workflowId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkflowCondition_workflowId_idx" ON public."WorkflowCondition" USING btree ("workflowId");


--
-- Name: WorkflowExecution_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkflowExecution_status_idx" ON public."WorkflowExecution" USING btree (status);


--
-- Name: WorkflowExecution_workflowId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkflowExecution_workflowId_idx" ON public."WorkflowExecution" USING btree ("workflowId");


--
-- Name: WorkflowTrigger_workflowId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkflowTrigger_workflowId_idx" ON public."WorkflowTrigger" USING btree ("workflowId");


--
-- Name: Workflow_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Workflow_category_idx" ON public."Workflow" USING btree (category);


--
-- Name: Workflow_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Workflow_status_idx" ON public."Workflow" USING btree (status);


--
-- Name: AIAnalysis AIAnalysis_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIAnalysis"
    ADD CONSTRAINT "AIAnalysis_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIFeedback AIFeedback_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIFeedback"
    ADD CONSTRAINT "AIFeedback_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."AIHelpConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIHelpMessage AIHelpMessage_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIHelpMessage"
    ADD CONSTRAINT "AIHelpMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."AIHelpConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AIMessage AIMessage_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIMessage"
    ADD CONSTRAINT "AIMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."AIConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ContentBlock ContentBlock_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentBlock"
    ADD CONSTRAINT "ContentBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."PageSection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ContentRevision ContentRevision_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentRevision"
    ADD CONSTRAINT "ContentRevision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CustomerNotification CustomerNotification_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerNotification"
    ADD CONSTRAINT "CustomerNotification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."CustomerProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CustomerPreference CustomerPreference_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerPreference"
    ADD CONSTRAINT "CustomerPreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."CustomerProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CustomerSession CustomerSession_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomerSession"
    ADD CONSTRAINT "CustomerSession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."CustomerProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DLC DLC_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DLC"
    ADD CONSTRAINT "DLC_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."GameContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmailLog EmailLog_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailLog"
    ADD CONSTRAINT "EmailLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GameFeature GameFeature_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GameFeature"
    ADD CONSTRAINT "GameFeature_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."GameContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GameMedia GameMedia_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GameMedia"
    ADD CONSTRAINT "GameMedia_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."GameContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GamePlatform GamePlatform_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GamePlatform"
    ADD CONSTRAINT "GamePlatform_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."GameContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InternalNote InternalNote_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InternalNote"
    ADD CONSTRAINT "InternalNote_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MediaAsset MediaAsset_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaAsset"
    ADD CONSTRAINT "MediaAsset_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."MediaFolder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MediaAsset MediaAsset_uploaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaAsset"
    ADD CONSTRAINT "MediaAsset_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MediaTag MediaTag_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaTag"
    ADD CONSTRAINT "MediaTag_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."MediaAsset"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MediaUsage MediaUsage_assetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaUsage"
    ADD CONSTRAINT "MediaUsage_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES public."MediaAsset"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PageSection PageSection_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PatchNote PatchNote_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PatchNote"
    ADD CONSTRAINT "PatchNote_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."GameContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Permission Permission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SEOData SEOData_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SEOData"
    ADD CONSTRAINT "SEOData_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamMember TeamMember_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketActivity TicketActivity_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketActivity"
    ADD CONSTRAINT "TicketActivity_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketAttachment TicketAttachment_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketAttachment"
    ADD CONSTRAINT "TicketAttachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketMessage TicketMessage_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_admin_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketMessage TicketMessage_contact_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_contact_fkey" FOREIGN KEY ("contactTicketId") REFERENCES public."ContactTicket"("ticketId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ticket Ticket_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkflowAction WorkflowAction_workflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowAction"
    ADD CONSTRAINT "WorkflowAction_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public."Workflow"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkflowCondition WorkflowCondition_workflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowCondition"
    ADD CONSTRAINT "WorkflowCondition_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public."Workflow"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkflowExecution WorkflowExecution_workflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowExecution"
    ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public."Workflow"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkflowTrigger WorkflowTrigger_workflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkflowTrigger"
    ADD CONSTRAINT "WorkflowTrigger_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES public."Workflow"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict TMPnXXTPBOLFx4jkVGrwXUFbbMLtgNUyDEK24sHmsVDU1PD3K9u5aoafe8nG1P5

