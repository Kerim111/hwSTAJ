
const Account = {
    id: 0,
    hesap_kodu: "",
    hesap_adi: "",
    tipi: "",
    ust_hesap_id: 0,
    borc: 0,
    alacak: 0,
    borc_sistem: 0,
    alacak_sistem: 0,
    borc_doviz: 0,
    alacak_doviz: 0,
    borc_islem_doviz: 0,
    alacak_islem_doviz: 0,
    birim_adi: "",
    bakiye_sekli: 0,
    aktif: 0,
    dovizkod: 0,
}

const TreeRow = {
    code: "",
    borc: 0,
    alacak: 0,
    children: [],
}

module.exports = { Account, TreeRow };
