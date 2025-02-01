/*
=========================================================
* Provisioning Portal - v1.0.0
=========================================================
* Copyright © 2024 Guardian Mobility All Rights Reserved
=========================================================
*/

// Imports
import axios from 'axios';

import getVoiceServiceAssignments from 'services/voiceServiceAssignments/getVoiceServiceAssignments';
import unassignVoiceService from 'services/voiceServiceAssignments/unassignVoiceService';
import getVoiceServiceListById from 'services/voiceServiceTemplate/getVoiceServiceListById.js';
import deleteVoiceLine from 'services/voiceLine/deleteVoiceLine.js'

// Default function
export default async function deleteVoiceService(templateId) {
  console.log("DELETE VOICE SERVICE", {templateId: templateId })
  const controller = new AbortController();
  const jwtToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  let voiceServiceTemplateAssignments;
  let voiceServiceVoiceLineTemplates;
  // get all assignments
  try {
    const voiceServiceAssignments = await getVoiceServiceAssignments(templateId)
    console.log('VOICE SERVICE ASSIGNMENTS', voiceServiceAssignments)
    if (voiceServiceAssignments) {
      voiceServiceTemplateAssignments = voiceServiceAssignments?.filter(a => a.template === templateId)
    } else {
      voiceServiceTemplateAssignments = false;
    }
    console.log('VOICE SERVICE ASSIGNMENTS by Account Number', voiceServiceTemplateAssignments)
  } catch (error) {
    // Handle errors
    if (error.response && (error.response.status === 401)) {
      if (error.response.data === "JWT authorization error") {
        console.error("JWT authorization error:", error.response.data);
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
      if (error.response.data?.message === 'token expired') {
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
    } else {
      console.error("Other get assignment error:", error.message);
    }
  }
  // delete all assignments
  if (voiceServiceTemplateAssignments) {
    voiceServiceTemplateAssignments.forEach(async v => {
      try {
        console.log("Account Voice Template Assignments",{template: v.template, id: v.id})
        await unassignVoiceService(v.template, v.id)
      } catch (error) {
        // Handle errors
        if (error.response && (error.response.status === 401)) {
          if (error.response.data === "JWT authorization error") {
            console.error("JWT authorization error:", error.response.data);
            //Delete token cookie 
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            window.location.href = '/login';
          }
          if (error.response.data?.message === 'token expired') {
            //Delete token cookie 
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            window.location.href = '/login';
          }
        } else {
          console.error("Other delete assignments error:", error.message);
        }
      }
    })
  } 
  // Get voice line templates
  try {
    const voiceLines = await getVoiceServiceListById(templateId)
    console.log('VOICE SERVICE ASSIGNMENTS', voiceLines)
    if (!voiceLines.voiceLineTemplates?.length >=0 || false) {
      voiceServiceVoiceLineTemplates = [...voiceLines.voiceLineTemplates]
    } else {
      voiceServiceVoiceLineTemplates = false;
    }
    console.log('VOICE LINE by Template', voiceServiceVoiceLineTemplates)
  } catch (error) {
    // Handle errors
    if (error.response && (error.response.status === 401)) {
      if (error.response.data === "JWT authorization error") {
        console.error("JWT authorization error:", error.response.data);
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
      if (error.response.data?.message === 'token expired') {
        //Delete token cookie 
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login';
      }
    } else {
      console.error("Other get assignment error:", error.message);
    }
  }
  // delete all voiceLines
  if (voiceServiceVoiceLineTemplates) {
    voiceServiceVoiceLineTemplates.forEach(async v => {
      try {
        console.log("VoiceService Template Voice Lines", { salesforceId: v.id })
        await deleteVoiceLine(v.id)
      } catch (error) {
        // Handle errors
        if (error.response && (error.response.status === 401)) {
          if (error.response.data === "JWT authorization error") {
            console.error("JWT authorization error:", error.response.data);
            //Delete token cookie 
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            window.location.href = '/login';
          }
          if (error.response.data?.message === 'token expired') {
            //Delete token cookie 
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            window.location.href = '/login';
          }
        } else {
          console.error("Other delete assignments error:", error.message);
        }
      }
    })
  }
  setTimeout(async () => {
    try {
      const verify = await axios.delete(`${process.env.REACT_APP_PROVISIONING_PORTAL_API_URL}/provisioning/certus/templates/voice/${templateId}`,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-GB,en-US,q=0.8,en;q=0.6",
            "Authorization": `Bearer ${jwtToken}`
          },
        });
      switch (verify.status) {
        case 201:
        case 200: return true;
        default: return true;
      }
    } catch (error) {
      // Handle errors
      if (error.response && (error.response.status === 401)) {
        if (error.response.data === "JWT authorization error") {
          console.error("JWT authorization error:", error.response.data);
          //Delete token cookie 
          document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          window.location.href = '/login';
        }
        if (error.response.data?.message === 'token expired') {
          //Delete token cookie 
          document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          window.location.href = '/login';
        }
      } else {
        console.error("Other error:", error.message);
      }
      return false;
    }
  },500)
}