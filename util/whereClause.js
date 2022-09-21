//  base- Product.find()
// bigQ - search=code&page=2&price[gte]=199&price[lte]=999&rating[gte]=4&limit=5
class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }
  search() {
    const searchTerm = this.bigQ.search
      console.log("🚀 ~ file: whereClause.js ~ line 10 ~ WhereClause ~ search ~ bigQ", this.bigQ)
      ? {
          name: { $regex: this.bigQ.search, $options: "i" },
        }
      : {};

    this.base = this.base.find({ ...searchTerm });
    console.log("🚀 ~ file: whereClause.js ~ line 17 ~ WhereClause ~ search ~ this.base.find({ ...searchTerm })", this.base.find({ ...searchTerm }))
    return this;
  }

  filter (){
    const copyQ = {...this.bigQ};
    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    // ..convert copyQ into string
    let stringOfCopyQ = JSON.stringify(copyQ);
    stringOfCopyQ = stringOfCopyQ.replace(/\b(gte | lte | gt | lt)/g, m => `$${m}`);
    const jsonOfCopyQ = JSON.parse(stringOfCopyQ);
    this.base = this.base.find(jsonOfCopyQ); 
  } 



//pagination important asf.
  pager(resultPerPage){
    let currentPage = 1;
    if(this.bigQ.page){
        currentPage = this.bigQ.page;
    }

    const skipValue = resultPerPage * (currentPage - 1);
    
    this.base = this.base.limit(resultPerPage).skip(skipValue);
    return this;
  }
}

module.exports = WhereClause;