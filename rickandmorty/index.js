const { createApp } = Vue;

createApp({
    data() {
        return {
            chars: [],
            loading: true,
            searchText: '',
            nextPage: 1
        }
    },
    computed: {
        filteredChars(){
            // console.log(this.chars.name)
            //return this.chars.filter(character => character.name.toLowerCase().includes(this.searchText.toLowerCase()))
        }
    },
    created() {
        this.fetchChars();
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        async fetchChars() {
            try {                
                const response = await fetch(`https://rickandmortyapi.com/api/character?page=${this.nextPage}`)                
                const data = await response.json();
                const characterDetailsPromises = data.results.map(async character => {
                    this.fetchCharData(character.url)
                })
                const characterDetails = await Promise.all(characterDetailsPromises)
                this.chars = [... this.chars, ... characterDetails];
                this.nextPage++;
                this.loading = false;
            } catch (error) {
                console.error(error)
            }
        },
        async fetchCharData(url){
            try {
                const response = await fetch(url);
                const data = await response.json();

                return {
                    id: data.id,
                    name: data.name,
                    species: data.species,
                    sprite: data.image
                }
            } catch (error) {
                console.error(error)
            }
        },
        getSpecies(type) {
            const speciesMap = {
                human: 'human',
                animal: 'animal',
                alien: 'alien',
                robot: 'robot'
            }

            return speciesMap[type] || ''
        },
        handleScroll() {
            const bottomOfWindow =
                document.documentElement.scrollTop + window.innerHeight ===
                document.documentElement.offsetHeight;

            if (bottomOfWindow && !this.loading) {
                this.loading = true;
                this.fetchChars();
            }
        }
    }

}).mount("#app");
