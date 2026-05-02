// Single responsibility: track generated commit messages and navigate them.
// New entries always append (never overwrite) so the user can compare every
// suggestion produced in this session. The cursor points at the entry the
// caller is currently showing.

export function createMessageHistory() {
    const entries = []
    let cursor = -1

    return {
        push(entry) {
            entries.push(entry)
            cursor = entries.length - 1
        },
        current() {
            return cursor >= 0 ? entries[cursor] : null
        },
        prev() {
            if (cursor > 0) cursor--
            return this.current()
        },
        next() {
            if (cursor < entries.length - 1) cursor++
            return this.current()
        },
        hasPrev() {
            return cursor > 0
        },
        hasNext() {
            return cursor < entries.length - 1
        },
        position() {
            return { index: cursor + 1, total: entries.length }
        },
    }
}
