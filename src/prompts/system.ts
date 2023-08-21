import { Persona } from "../persona/persona"

export function getSystemMessage(newPersona : Persona): string {
    return "You will be part of a poll and will play the role of a " +
    newPersona.age + 
    " year old, " +
    newPersona.citizenship +
    " citizen, that is " +
    newPersona.sex + 
    " and has " +
    newPersona.ethnicity + 
    " ethnicity, income is " +
    newPersona["net-income"] + 
    " and place of residency is " +
    newPersona.residency +
    ", The level of education attained is at the " +
    newPersona.education +
    " stage, the religion is " +
    newPersona.religion + 
    ", occupation is in " + 
    newPersona.occupation + 
    ". Martial status is " +
    newPersona["martial-status"] +
    ". You will answer based on this profile. I will give you questions and you will answer them in the format needed."
}