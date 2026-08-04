"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const bridge = {
    runtime: {
        testConnection: (request) => electron_1.ipcRenderer.invoke("runtime:testConnection", request),
        listProviderModels: (request) => electron_1.ipcRenderer.invoke("runtime:listProviderModels", request),
        generateImage: (request) => electron_1.ipcRenderer.invoke("runtime:generateImage", request),
        getImageTaskState: (taskId) => electron_1.ipcRenderer.invoke("runtime:getImageTaskState", taskId),
        cancelImageTask: (taskId) => electron_1.ipcRenderer.invoke("runtime:cancelImageTask", taskId),
        onImageTaskState: (callback) => {
            const listener = (_event, payload) => callback(payload);
            electron_1.ipcRenderer.on("runtime:imageTaskState", listener);
            return () => electron_1.ipcRenderer.removeListener("runtime:imageTaskState", listener);
        },
        generateVideo: (request) => electron_1.ipcRenderer.invoke("runtime:generateVideo", request),
        submitVideoTask: (request) => electron_1.ipcRenderer.invoke("runtime:submitVideoTask", request),
        queryVideoTask: (request) => electron_1.ipcRenderer.invoke("runtime:queryVideoTask", request),
        submitAudioTask: (request) => electron_1.ipcRenderer.invoke("runtime:submitAudioTask", request),
        queryAudioTask: (request) => electron_1.ipcRenderer.invoke("runtime:queryAudioTask", request),
        uploadAudioTask: (request) => electron_1.ipcRenderer.invoke("runtime:uploadAudioTask", request),
        removeBackground: (request) => electron_1.ipcRenderer.invoke("runtime:removeBackground", request),
        getUpscaylStatus: (engineRoot) => electron_1.ipcRenderer.invoke("runtime:getUpscaylStatus", engineRoot),
        upscaleImage: (request) => electron_1.ipcRenderer.invoke("runtime:upscaleImage", request),
        reverseAnalyze: (request) => electron_1.ipcRenderer.invoke("runtime:reverseAnalyze", request),
        chat: (request) => electron_1.ipcRenderer.invoke("runtime:chat", request),
        startChatStream: (request) => electron_1.ipcRenderer.invoke("runtime:startChatStream", request),
        onChatStream: (callback) => {
            const listener = (_event, payload) => callback(payload);
            electron_1.ipcRenderer.on("runtime:chatStream", listener);
            return () => electron_1.ipcRenderer.removeListener("runtime:chatStream", listener);
        },
        getComfyRongtuStatus: (request) => electron_1.ipcRenderer.invoke("runtime:getComfyRongtuStatus", request),
        generateComfyRongtu: (request) => electron_1.ipcRenderer.invoke("runtime:generateComfyRongtu", request),
        getComfyInstances: () => electron_1.ipcRenderer.invoke("runtime:getComfyInstances"),
        saveComfyInstances: (instances) => electron_1.ipcRenderer.invoke("runtime:saveComfyInstances", instances),
        listComfyWorkflows: () => electron_1.ipcRenderer.invoke("runtime:listComfyWorkflows"),
        getComfyWorkflow: (name) => electron_1.ipcRenderer.invoke("runtime:getComfyWorkflow", name),
        uploadComfyWorkflow: (request) => electron_1.ipcRenderer.invoke("runtime:uploadComfyWorkflow", request),
        saveComfyWorkflowConfig: (name, config) => electron_1.ipcRenderer.invoke("runtime:saveComfyWorkflowConfig", name, config),
        deleteComfyWorkflow: (name) => electron_1.ipcRenderer.invoke("runtime:deleteComfyWorkflow", name),
        runComfyWorkflow: (request) => electron_1.ipcRenderer.invoke("runtime:runComfyWorkflow", request),
    },
    agentControl: {
        status: () => electron_1.ipcRenderer.invoke("agentControl:status"),
        ensureSession: () => electron_1.ipcRenderer.invoke("agentControl:ensureSession"),
        createSession: (title) => electron_1.ipcRenderer.invoke("agentControl:createSession", title),
        listSessions: () => electron_1.ipcRenderer.invoke("agentControl:listSessions"),
        getSession: (sessionId) => electron_1.ipcRenderer.invoke("agentControl:getSession", sessionId),
        appendMessage: (sessionId, message) => electron_1.ipcRenderer.invoke("agentControl:appendMessage", sessionId, message),
        saveSuggestions: (sessionId, suggestions) => electron_1.ipcRenderer.invoke("agentControl:saveSuggestions", sessionId, suggestions),
        updateSnapshot: (snapshot) => electron_1.ipcRenderer.invoke("agentControl:updateSnapshot", snapshot),
        submitPlan: (plan) => electron_1.ipcRenderer.invoke("agentControl:submitPlan", plan),
        listPlans: (status) => electron_1.ipcRenderer.invoke("agentControl:listPlans", status),
        getPlan: (planId) => electron_1.ipcRenderer.invoke("agentControl:getPlan", planId),
        approvePlan: (planId) => electron_1.ipcRenderer.invoke("agentControl:approvePlan", planId),
        rejectPlan: (planId, note) => electron_1.ipcRenderer.invoke("agentControl:rejectPlan", planId, note),
        completePlan: (planId, result) => electron_1.ipcRenderer.invoke("agentControl:completePlan", planId, result),
        listReceipts: () => electron_1.ipcRenderer.invoke("agentControl:listReceipts"),
        startPairing: (label) => electron_1.ipcRenderer.invoke("agentControl:startPairing", label),
        onEvent: (callback) => {
            const listener = (_event, payload) => callback(payload);
            electron_1.ipcRenderer.on("agentControl:event", listener);
            return () => electron_1.ipcRenderer.removeListener("agentControl:event", listener);
        },
    },
    codexAppServer: {
        status: () => electron_1.ipcRenderer.invoke("codexAppServer:status"),
        start: (request) => electron_1.ipcRenderer.invoke("codexAppServer:start", request),
        stop: () => electron_1.ipcRenderer.invoke("codexAppServer:stop"),
        readAccount: (refreshToken) => electron_1.ipcRenderer.invoke("codexAppServer:readAccount", refreshToken),
        installCanvasMcp: () => electron_1.ipcRenderer.invoke("codexAppServer:installCanvasMcp"),
        login: (type, credential) => electron_1.ipcRenderer.invoke("codexAppServer:login", type, credential),
        cancelLogin: (loginId) => electron_1.ipcRenderer.invoke("codexAppServer:cancelLogin", loginId),
        logout: () => electron_1.ipcRenderer.invoke("codexAppServer:logout"),
        listModels: () => electron_1.ipcRenderer.invoke("codexAppServer:listModels"),
        listThreads: (request) => electron_1.ipcRenderer.invoke("codexAppServer:listThreads", request),
        readThread: (threadId, includeTurns) => electron_1.ipcRenderer.invoke("codexAppServer:readThread", threadId, includeTurns),
        startThread: (request) => electron_1.ipcRenderer.invoke("codexAppServer:startThread", request),
        resumeThread: (threadId) => electron_1.ipcRenderer.invoke("codexAppServer:resumeThread", threadId),
        startTurn: (request) => electron_1.ipcRenderer.invoke("codexAppServer:startTurn", request),
        interrupt: (threadId, turnId) => electron_1.ipcRenderer.invoke("codexAppServer:interrupt", threadId, turnId),
        resolveApproval: (requestId, action, options) => electron_1.ipcRenderer.invoke("codexAppServer:resolveApproval", requestId, action, options),
        selectWorkspace: () => electron_1.ipcRenderer.invoke("codexAppServer:selectWorkspace"),
        onEvent: (callback) => {
            const listener = (_event, payload) => callback(payload);
            electron_1.ipcRenderer.on("codexAppServer:event", listener);
            return () => electron_1.ipcRenderer.removeListener("codexAppServer:event", listener);
        },
    },
    channelDriver: {
        list: () => electron_1.ipcRenderer.invoke("channelDriver:list"),
        catalog: () => electron_1.ipcRenderer.invoke("channelDriver:catalog"),
        save: (definition) => electron_1.ipcRenderer.invoke("channelDriver:save", definition),
        remove: (id) => electron_1.ipcRenderer.invoke("channelDriver:remove", id),
        setSessionSecrets: (id, secrets) => electron_1.ipcRenderer.invoke("channelDriver:setSessionSecrets", id, secrets),
        invoke: (id, input, secrets) => electron_1.ipcRenderer.invoke("channelDriver:invoke", id, input, secrets),
    },
    skillFactory: {
        status: () => electron_1.ipcRenderer.invoke("skillFactory:status"),
        configure: (request) => electron_1.ipcRenderer.invoke("skillFactory:configure", request),
        start: (request) => electron_1.ipcRenderer.invoke("skillFactory:start", request),
        getJob: (id) => electron_1.ipcRenderer.invoke("skillFactory:getJob", id),
        listJobs: () => electron_1.ipcRenderer.invoke("skillFactory:listJobs"),
        cancel: (id) => electron_1.ipcRenderer.invoke("skillFactory:cancel", id),
        selectFiles: (request) => electron_1.ipcRenderer.invoke("skillFactory:selectFiles", request),
        selectDirectory: () => electron_1.ipcRenderer.invoke("skillFactory:selectDirectory"),
    },
    industrial3d: {
        selectFiles: () => electron_1.ipcRenderer.invoke("industrial3d:selectFiles"),
        convertStep: (filePath) => electron_1.ipcRenderer.invoke("industrial3d:convertStep", filePath),
    },
    system: {
        selectFiles: (request) => electron_1.ipcRenderer.invoke("system:selectFiles", request),
        selectChatAttachments: (request) => electron_1.ipcRenderer.invoke("system:selectChatAttachments", request),
        selectDirectory: () => electron_1.ipcRenderer.invoke("system:selectDirectory"),
        openPath: (path) => electron_1.ipcRenderer.invoke("system:openPath", path),
        openExternal: (url) => electron_1.ipcRenderer.invoke("system:openExternal", url),
        getAppVersion: () => electron_1.ipcRenderer.invoke("system:getAppVersion"),
        downloadUpdate: (request) => electron_1.ipcRenderer.invoke("system:downloadUpdate", request),
        onUpdateDownloadProgress: (callback) => {
            const listener = (_event, payload) => callback(payload);
            electron_1.ipcRenderer.on("system:updateDownloadProgress", listener);
            return () => electron_1.ipcRenderer.removeListener("system:updateDownloadProgress", listener);
        },
        saveAsset: (request) => electron_1.ipcRenderer.invoke("system:saveAsset", request),
        readTextFile: (request) => electron_1.ipcRenderer.invoke("system:readTextFile", request),
        readMediaDataUrl: (request) => electron_1.ipcRenderer.invoke("system:readMediaDataUrl", request),
        readCommunityAsset: (request) => electron_1.ipcRenderer.invoke("system:readCommunityAsset", request),
        exportLayeredPsd: (request) => electron_1.ipcRenderer.invoke("system:exportLayeredPsd", request),
        openGenPsd: (request) => electron_1.ipcRenderer.invoke("system:openGenPsd", request),
        generateHunyuan3D: (request) => electron_1.ipcRenderer.invoke("system:generateHunyuan3D", request),
        saveProject: (payload) => electron_1.ipcRenderer.invoke("system:saveProject", payload),
        loadProject: () => electron_1.ipcRenderer.invoke("system:loadProject"),
        startNewProject: () => electron_1.ipcRenderer.invoke("system:startNewProject"),
        listSavedProjects: () => electron_1.ipcRenderer.invoke("system:listSavedProjects"),
        loadSavedProject: (projectId) => electron_1.ipcRenderer.invoke("system:loadSavedProject", projectId),
        deleteSavedProject: (projectId) => electron_1.ipcRenderer.invoke("system:deleteSavedProject", projectId),
        getStats: () => electron_1.ipcRenderer.invoke("system:getStats"),
        getDefaultPaths: () => electron_1.ipcRenderer.invoke("system:getDefaultPaths"),
        listResources: (request) => electron_1.ipcRenderer.invoke("system:listResources", request),
        addResource: (request) => electron_1.ipcRenderer.invoke("system:addResource", request),
        updateResource: (id, patch) => electron_1.ipcRenderer.invoke("system:updateResource", id, patch),
        deleteResource: (id) => electron_1.ipcRenderer.invoke("system:deleteResource", id),
        loadPreferences: () => electron_1.ipcRenderer.invoke("system:loadPreferences"),
        savePreferences: (preferences) => electron_1.ipcRenderer.invoke("system:savePreferences", preferences),
        queryApiBalance: (request) => electron_1.ipcRenderer.invoke("system:queryApiBalance", request),
        windowCommand: (command) => electron_1.ipcRenderer.invoke("system:windowCommand", command),
        getZoom: () => electron_1.ipcRenderer.invoke("system:getZoom"),
        setZoom: (zoomPercent) => electron_1.ipcRenderer.invoke("system:setZoom", zoomPercent),
        getMachineCode: () => electron_1.ipcRenderer.invoke("system:getMachineCode"),
        loadLicense: () => electron_1.ipcRenderer.invoke("system:loadLicense"),
        activateLicense: (request) => electron_1.ipcRenderer.invoke("system:activateLicense", request),
        verifyLicense: () => electron_1.ipcRenderer.invoke("system:verifyLicense"),
        consumeLicenseQuota: (request) => electron_1.ipcRenderer.invoke("system:consumeLicenseQuota", request),
    },
};
electron_1.contextBridge.exposeInMainWorld("jiaren", bridge);
