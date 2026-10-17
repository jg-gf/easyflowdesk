<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep spreadsheet parsing, persisted-state validation, status transitions, and KPI calculations in `src/lib/flowdesk-data.ts` so import rules can be tested independently of the UI.
- Load SheetJS only from the browser file-selection flow and persist the complete team/task state in versioned localStorage; monthly spreadsheets must never be uploaded.
- Keep theme selection in the header's `ThemeToggle`, applying the document-level dark class after hydration and saving it independently from task data so data resets do not reset the theme.
