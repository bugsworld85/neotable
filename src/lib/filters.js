module.exports = {
    highlight: (words, query, scopeId) => {
        var check = "";

        if (query === null && extraQuery !== null) {
            check = new RegExp(extraQuery, "ig");
        } else {
            check = new RegExp(query, "ig");
        }

        if (words === null) {
            return words;
        }
        return words.toString().replace(check, function (matched) {
            return `<span class="highlight" ${scopeId}>${matched}</span>`;
        });
    },
};
