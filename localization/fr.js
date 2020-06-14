module.exports = {
    Localization: function() {
        this.LABELS = [
            "Dimanche", // 0
            "Lundi-AM", // 1
            "Lundi-PM", // 2
            "Mardi-AM", // 3
            "Mardi-PM", // 4
            "Mercredi-AM", // 5
            "Mercredi-PM", //6
            "Jeudi-AM", //7
            "Jeudi-PM", //8
            "Vendredi-AM", //9
            "Vendredi-PM", //10
            "Samedi-AM", //11
            "Samedi-PM" //12
        ]
        this.DAYLOOKUP = {
            0:"Dimanche",
            1: "Lundi",
            2: "Mardi", 
            3: "Mercredi", 
            4: "Jeudi", 
            5: "Vendredi", 
            6: "Samedi", 
        }
        this.dateFormat = "DD/MM/YYYY"
        this.xScaleLabel = "Date/Heure"
        this.yScaleLabel = "Clochettes par navet"
        this.graphTitle = "Sow Joan's Index - Semaine du "
        this.authorDelete = (author) => `${author} a supprimé une liste.`
        this.newPost = (author, value, date) => `${author} vient de poster ${value} le ${date.toDateString()}! `;
        this.noPrice = () => `\nPersonne n'a publié ses taux pour aujourd'hui`
        this.maxPrice = (max) => `\nVous pouvez obtenir des navets pour ${max.value} par ${max.user}`
        this.noMax = () => `\nQuoi ? Les navets sont à 0 clochettes!`;
        this.hasMax = (max) => `\n${max.user} vend des navets pour ${max.value} clochettes!`;
        this.noUser = (args, users) => `L'utilisateur ${args.join(" ")} n'existe pas sur ce serveur. Essayez peut-être:\n${users.join('\n')}`
        this.noPrevWeek = (prevWeek) => `Nous n'avons aucune donnée pour ${prevWeek}`
        this.noData = (args) => `Nous n'avons aucune donnée pour ${args[0]}`
        this.basicHelp = (channelPrefix) => {
            return `
        Quelques commandes régulières:
            ${channelPrefix}report <taux> Poster un taux pour l'heure actuelle
            ${channelPrefix}report none Supprimer un taux pour l'heure actuelle
            ${channelPrefix}report <nombre> <jour>-<am|pm> Poster un taux pour une période spécifique
        Pour obtenir le graphique d'un membre:
            ${channelPrefix}graph <pseudo> Ne vous inquiétez pas si vous vous trompez! Le bot vous le fera savoir dans les options.
Quelques exemples!
            ${channelPrefix}report 50
            ${channelPrefix}report none
            ${channelPrefix}report 50 monday-pm
            ${channelPrefix}graph blaleb
        Vous ne voyez pas une commande que vous aimeriez ou vous avez des suggestions? Rejoignez le Discord pour aider au développement.`
        }
        this.adminHelp = (channelPrefix, languages) => {
            return `
                Langages actuellement disponibles: ${languages}
                ${channelPrefix}switch <langage|prefix|timezone> <votre langue/prefix/timezone>
            Pour la liste des timzones acceptés, rendez-vous sur https://momentjs.com/timezone/ , Exemple: America/New_York`
        }
    }
}