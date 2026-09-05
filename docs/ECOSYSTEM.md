# Website ecosystem and handoff boundaries

Source audit dated 2026-09-04. Vercel project names below come from local .vercel/project.json records. Active deployment commits, project settings, secrets, live database migrations and cron health were not authenticated against Vercel in this review. Treat source configuration and deployed configuration as separate evidence.

| Requested website | GitHub source | Application / locally recorded Vercel project |
| --- | --- | --- |
| carbogenetics.com | breathIQ/carbogenetics-site | Root Next.js app / carbogenetics-site |
| co2body.com | breathIQ/ai-affiliate-content-steven-Frontend | CRA frontend / co2body-frontend |
| api.co2body.com (required by co2body.com) | breathIQ/co2body-api | Next.js API / co2body-api |
| bendly-service.vercel.app | breathIQ/DesignBridge, newer LOCAL source | apps/service / bendly-service |
| freedom-tape-site.vercel.app | Generated local directory, NOT tracked by Git | DesignBridge/out/freedom-tape-site / freedom-tape-site |

## Verified source versions

Carbogenetics: GitHub HEAD 63aa9cb. Its original local checkout is at f592085 with unrelated modifications; the audit uses a separate worktree to preserve them. CO2Body API: e84dd75. CO2Body frontend: 926e7b4. Bendly: local main 2556494, ahead of GitHub main 153b749 by 113 commits with zero commits behind. Do not confuse these snapshots with Vercel deployment provenance.

The Bendly public service, editor and compiler exist in the newer local commit but not in the reviewed GitHub main. Freedom Tape's generated code lives under a Git-ignored out directory. These are source-recovery gaps: having a working Vercel URL does not establish that a GitHub clone can recreate it.

## Cross-project dependencies

CO2Body's browser code calls api.co2body.com/api/v1 through a hardcoded constant in src/services/contants.js. Both repositories must agree on authentication, response envelopes and asynchronous post status. A frontend redeploy does not update API behavior.

Carbogenetics and CO2Body documentation identifies a shared Supabase project, with the API using the co2body schema. Bendly's local code and handoff also reference this Supabase ecosystem. Separate applications do not automatically mean separate infrastructure. Confirm each role, schema and table dependency before migrations or credential changes; never assume a change is isolated because its Vercel project is separate.

CO2Body provisions Carbogenetics affiliates through authenticated server-to-server routes. Preserve referral/campaign contracts when changing either application. Shared secrets are server configuration, not frontend build variables.

Scheduling differs: CO2Body API has seven Vercel crons in vercel.json; Carbogenetics mainly uses Supabase pg_cron/pg_net workers and also documents a local Windows bank-sync job. Bendly's local editor is a filesystem-backed application distinct from its public hosted service.

## Source restoration priorities

1. Preserve and reconcile the 113 local Bendly commits with GitHub through an explicit source-sync review. Do not overwrite them with the older GitHub tree or push them straight to the production branch as a documentation change.
2. Preserve Freedom Tape's generated code/assets and its upstream editor document/assets. Choose a tracked source or asset-backup location and prove a fresh-machine rebuild. The generated-source snapshot supplied with this handoff does not contain upstream tenant settings or private project data.
3. Confirm each active Vercel deployment's repository, branch, commit, root directory, framework, build/output settings and required environment names. Record the result in the owning guide without copying secret values.
4. Confirm applied database migrations and recovery procedures. Historical DNS rollback instructions and handoff test counts are not current recovery or test evidence.

## Documentation maintenance

Each repository has a practical onboarding guide or README plus a generated docs/SOURCE_REFERENCE.md. Run node scripts/documentation-index.mjs from the intended source checkout when tracked code changes. It indexes files, Next.js route exports, literal environment names and SQL CREATE TABLE declarations; it does not infer permissions, execute SQL or contact services.

Document why a subsystem exists, which application owns it, how failures/retries work, and what must remain compatible. Keep old migration notes labeled as history. Keep secrets out of documentation. Link new system guides from README.md so a fresh developer can discover them without chat history.

## Handoff branch

The handoff is prepared on docs/developer-handoff-20260904 in each repository. The DesignBridge branch includes the existing local source history so its guide and source links can be used together. Default/production branches are unchanged; merging the Bendly branch would include those 113 pre-existing source commits and needs a separate source review.
