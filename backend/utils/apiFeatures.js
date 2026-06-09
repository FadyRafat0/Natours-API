class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1) Basic Filtering
        const queryObj = { ...this.queryString };

        const filterFields = ['sort', 'fields', 'page', 'limit'];
        filterFields.forEach((el) => {
            delete queryObj[el];
        });

        // Manually -> { duration: { $gte: 5 } }
        // 2) Advanced Filtering (gt, gte, lt, lte)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        // Manually -> query.sort('price -ratings');
        // 3) Sotring
        const sortBy = this.queryString.sort
            ? this.queryString.sort.split(',').join(' ')
            : '_id';

        this.query = this.query.sort(sortBy);

        return this;
    }

    limitFields() {
        // Manually -> query.select('name -duration')
        // 4) Field Limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        // Manually -> query.skip(num).query(limit)
        // 5) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default APIFeatures;
