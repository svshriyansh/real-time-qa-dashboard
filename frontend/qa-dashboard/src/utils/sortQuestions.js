export function sortQuestions(list) {
    const priority = {
        Escalated: 0,
        Pending: 1,
        Answered: 2
    };

    return [...list].sort(
        (a, b) =>
            priority[a.status] - priority[b.status] ||
            new Date(b.timestamp) - new Date(a.timestamp)
    );
}
