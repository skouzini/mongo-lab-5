/*global Vue*/
/*global axios*/

var app = new Vue({
  
  el: '#admin',
  
  data: {
    title: "",
    file: null,
    addItem: null,
    items: [],
    findTitle: "",
    findItem: null,
    description: "",
  },
  
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
  
  created() {
    this.getItems();
  },
  
  methods: {
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    
     async deleteItem(item) {
      try {
        console.log(`Item id ${ item._id }`)
        let response = axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          description: this.findItem.description,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/items', {
          title: this.title,
          path: r1.data.path,
          description: this.description
        });
        this.addItem = r2.data;
      }
      catch (error) {
        console.log(error);
      }
    },
    
  },
  
});
