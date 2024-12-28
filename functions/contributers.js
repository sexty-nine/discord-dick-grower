module.exports = {
    getAllContributors: async(repoName) => {
        let contributors = [];
        let page = 1;
        do {
            list = await module.exports.getContributors(repoName, page);
            contributors = contributors.concat(list);
            page++;
        } while (list.length > 0);
        // while (list.length%100 !== 0)
        const embeds = contributors.map((contributor, index) => {
            return {
                title: `Contributor #${index + 1}`,
                thumbnail: {
                    url: contributor.avatar_url,
                },
                description: `**Username**: ${contributor.login}\n**Contributions**: ${contributor.contributions}`,
            };
        });
        return embeds;
    },
    getContributors: async (repoName, page = 1) => {  
        let request = await fetch(`https://api.github.com/repos/${repoName}/contributors?per_page=100&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    
        // print data from the fetch on screen
        let contributorsList = await request.json();
        return contributorsList;
    },
}