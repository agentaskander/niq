import { roleScopes } from "./roleScopes";
import { specialties } from "./specialties";
import type { NarrativeClause, OntologyStudioState, OntologyVersion, RoleScopeId, Specialty } from "../lib/types";

const seedCreatedAt = "2026-05-12T00:00:00.000Z";

function countSeedSymptoms(packs: Specialty[]) {
  return new Set(packs.flatMap((specialty) => specialty.complaintGroups.flatMap((group) => group.symptoms.map((symptom) => symptom.id)))).size;
}

const seedClauses: NarrativeClause[] = specialties.flatMap((specialty) =>
  specialty.complaintGroups.flatMap((group) =>
    group.narrativeClauses?.map((clause) => ({
      ...clause,
      clauseId: clause.clauseId,
      mode: clause.mode,
      roleScope: clause.roleScope,
      specialtyId: specialty.id,
      complaintGroupId: group.id
    })) ?? []
  )
);

const seedRoleRestrictions = roleScopes.reduce<Record<RoleScopeId, string[]>>((acc, role) => {
  acc[role.id] = role.restrictedLanguage;
  return acc;
}, {} as Record<RoleScopeId, string[]>);

const seedVersion: OntologyVersion = {
  versionId: "trusted-seed-2026-05-12",
  createdAt: seedCreatedAt,
  label: "Trusted seed ontology",
  notes: "Canonical NarrativeIQ seed specialty packs.",
  specialtyCount: specialties.length,
  symptomCount: countSeedSymptoms(specialties),
  clauseCount: seedClauses.length
};

export const seedOntology: OntologyStudioState = {
  specialties,
  clauses: seedClauses,
  roleRestrictions: seedRoleRestrictions,
  versions: [seedVersion],
  activeVersionId: seedVersion.versionId,
  updatedAt: seedCreatedAt,
  source: "seed"
};
