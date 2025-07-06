function buildTree(accounts) {
    var roots = [];
    const tree = {};
    accounts.forEach(account => {
        if(account.tipi == "A"){
            if(!roots.includes(account.ust_hesap_id)){
                roots.push(account.ust_hesap_id);
                var newroot = {
                    code: account.ust_hesap_id,
                    borc: account.borc || 0,
                    alacak: account.alacak || 0,
                    children: [],
                };
                tree[account.ust_hesap_id] = newroot;
                var newChild = {
                    code: account.hesap_kodu,
                    borc: account.borc || 0,
                    alacak: account.alacak || 0,
                    children: [],
                };
                tree[account.ust_hesap_id].children.push(newChild);
            }
            else{
                var oldroot = tree[account.ust_hesap_id];

                let borc = parseFloat(account.borc || 0) + parseFloat(oldroot.borc || 0);
                let alacak = parseFloat(account.alacak || 0) + parseFloat(oldroot.alacak || 0);
                oldroot.borc = borc;
                oldroot.alacak = alacak;
                var newChild = {
                    code: account.hesap_kodu,
                    borc: parseFloat(account.borc || 0),
                    alacak: parseFloat(account.alacak || 0),
                    children: [],
                };
                oldroot.children.push(newChild);
            }
        }
        else{
            var newB = {
                code: account.hesap_kodu,
                borc: account.borc,
                alacak: account.alacak,
                children: [],
            };
            tree[account.hesap_kodu.substring(0,3)].children.find(child => child.code === account.hesap_kodu.substring(0,6)).children.push(newB);
        }

    });
    return tree;
}

module.exports = buildTree;






