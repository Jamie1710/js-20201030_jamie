export default class SortableTable {
    constructor(header = [], {data = []} = {}) {
        this.header = header;
        this.data = data;
        this.subElements = {};
        this.render();
    }

    render() {
        this.element = this.template;    
        this.subElements = this.getTableContainer();
    }

    getTableContainer() {
        const tableContainer = {};
        const dataElements = this.element.querySelectorAll('[data-element]');

        for (let el of dataElements) {
            tableContainer[el.dataset.element] = el;
        }
        return tableContainer;
    }

    get template() {
        const divElement = document.createElement('div');
        divElement.innerHTML = `<div class="sortable-table">
                                    <div data-element="header" class="sortable-table__header sortable-table__row">
                                        ${this.getHeader()}    
                                    </div>                                
                                    <div data-element="body" class="sortable-table__body">
                                        ${this.getTableBody(this.data)}
                                    </div>
                                </div>`;
        return divElement.firstChild;
    }

    getHeader() {        
        const headerElements = this.header.map( item => {
            return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
                        <span>${item.title}</span>
                        <span data-element="arrow" class="sortable-table__sort-arrow">
                            <span class="sort-arrow"></span>
                        </span>
                    </div>`;
        }).join('');
        return headerElements;        
    }

    getTableBody(dataElements) {
        const bodyElements = dataElements.map( item => { 
            return `<a href="#" class="sortable-table__row">   
            
                        ${this.getTableCell(item)}
                        
                    </a>`
        }).join('');
        return bodyElements;
    }

    getTableCell(item) {
        const cells = this.header.map( ({ id, template }) => {
            if (template) return template(item[id]);
            return `<div class="sortable-table__cell">${item[id]}</div>`;  
        }).join('');
        return cells;
    }    
    
    sort(fieldValue, orderValue) {
        let direction;
        const index = this.header.findIndex( obj => obj.id === fieldValue );
        const sortType = this.header[index].sortType;

        if (orderValue === 'asc') direction = 1;
        else if (orderValue === 'desc') direction = -1;

        const arrSort = this.data.sort( (obj1, obj2) => {
            let comp1 = obj1[fieldValue];
            let comp2 = obj2[fieldValue];

            switch(sortType) {
                case 'string': 
                    return direction * comp1.localeCompare(comp2, ['ru', 'en'], {caseFirst: 'upper'}) ;
                    
                case 'number': 
                    return direction * (comp1 - comp2);                
            }
        } );

        this.setOrder(fieldValue, orderValue) ;
        this.subElements.body.innerHTML = this.getTableBody(arrSort);
    }

    setOrder(fieldValue,orderValue) {
        this.subElements.header.querySelectorAll('div').forEach(element => {
            if (element.dataset.id === fieldValue) element.dataset.order = orderValue;
        });
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = null;
    }    

}

