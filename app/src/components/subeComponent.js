import React, {Component, Fragment} from 'react';
import {
    getData,
    dataResult
} from '../actions';
import {connect} from 'react-redux';
import xml2js from 'xml2js';
import Helper from '../helper';
import * as CITIES_DATA from '../constants/cities';

class SubeComponent extends Component {
    refAutoComplete = React.createRef();
    autoCompleteData = [];
    shownValsAutoComplete = [];

    selectedCityNo = null;
    selectedSubeName = null;
    refInputSubeKod = React.createRef();
    refSelectSube = React.createRef();

    manipulatedSubeDataArr = null;

    selectedSubeObj = null;
    showMoreDetail = false;

    errorMessage = null;

    activeAutoCompleteNo = -1;

    isLoading = true;

    constructor(props) {
        super(props);
        props.dispatch(getData())
            .then((res) => {
                if (res.status === 200) {
                    let xml = res.data;
                    let parser = new xml2js.Parser();
                    parser.parseString(xml, function (err, result) {
                        // console.dir(result);
                        props.dispatch(dataResult(result));
                    });

                    this.isLoading = false;
                    this.forceUpdate();
                }
            });
    }

    componentDidMount() {
        /*
                setTimeout(()=>{
                    this.refInputSubeKod.current.value = 2461;
                    this.getSubeBySubeKodu();
                },1000)
        */

        document.addEventListener('keydown', this.onWindowKeyDown)

    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onWindowKeyDown)
    }

    //todo : to get data on key props change
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.subeData) {

            //todo : autocomplete datasının hazırlanması
            for (let i = 0; i < nextProps.subeData.length; i++) {
                let sube = nextProps.subeData[i];
                let subeAd = sube.Sube_Adi_Ad;
                let subeKod = sube.Sube_Sube_Kd;
                let subeIsim = Helper.getCityNameByNo(sube.Sube_Il_Kd);

/*
                let obj = {
                    val: subeAd + "-" + subeKod + "-" + subeIsim,
                    text: subeKod
                };
*/

                let val = subeAd + "-" + subeKod + "-" + subeIsim;

                sube.combinedAutoCompleteVal = val;

                // this.autoCompleteData.push(obj);

                this.autoCompleteData.push(sube);
            }

            //todo : subeData ataması ! eğer seçilen şehir yoksa bütün data eğer var ise filtrelenmiş data için
            //todo : reducerdaki datayı ham kullanmak yerine manipulatedDataArr objesini kullandık.
            this.manipulatedSubeDataArr = nextProps.subeData;
        }

        return true;
    }

    //todo : autocomplete
    onKeyUp = (e) => {
        this.shownValsAutoComplete = [];

        if (this.refAutoComplete.current.value.length > 0) {

            this.shownValsAutoComplete = this.autoCompleteData.filter((x,i)=>{
                let data = x.combinedAutoCompleteVal.toLocaleLowerCase();
                let inputVal = this.refAutoComplete.current.value.toLocaleLowerCase();

                let regData = new RegExp(inputVal);
                if (regData.test(data)) {
                    return x;
                }
            });
            this.forceUpdate()
        }
        else{
            this.shownValsAutoComplete = [];
            this.forceUpdate();
        }
    };

    //todo : selectbox change city
    onChangeCity = (e) => {
        this.clearAutoComplete();

        this.manipulatedSubeDataArr = [];

        //todo > eğer seçiniz opsiyonu seçilirse bütün data gelecek
        if (e.target.value === '') {
            this.selectedCityNo = null;
            this.manipulatedSubeDataArr = this.props.subeData;
        }
        //todo > eğer il seçilirse sadece o illerin datası filtrelenecek.
        else {
            this.selectedCityNo = e.target.value;

            this.props.subeData.filter(val => {
                if (val.Sube_Il_Kd && val.Sube_Il_Kd[0]) {
                    if (val.Sube_Il_Kd.toString() == this.selectedCityNo) {
                        this.manipulatedSubeDataArr.push(val);
                    }
                }
            });
        }

        this.forceUpdate();
    };

    //todo : selectbox change sube
    onChangeSube = (e) => {
        this.clearAutoComplete();

        if (e.target.value === '') {
            return;
        }

        this.selectedSubeName = e.target.value;

        this.props.subeData.forEach((sube, i) => {
            // console.log("1 " ,sube.Sube_Adi_Ad[0]);
            // console.log("2 " ,this.selectedSubeName);
            if (this.selectedSubeName === sube.Sube_Adi_Ad[0]) {
                if (sube.Sube_KapanisTarihi_Tr) {
                    this.errorMessage = "Aradığınız şube kapalıdır";
                    this.refSelectSube.current.selectedIndex = 0;
                    this.forceUpdate();
                }
                else {
                    this.selectedSubeObj = sube;
                    // console.log("selected sube ", this.selectedSubeObj);
                    this.forceUpdate();
                }
            }
        });
    };

    //todo : for input
    getSubeBySubeKodu = (enteredCode) => {
        if (enteredCode.trim() === '') {
            this.errorMessage = "Lütfen şube kodu giriniz.";
            this.forceUpdate();
        }
        else {
            for (let i = 0; i < this.props.subeData.length; i++) {
                const val = this.props.subeData[i];

                if (val.Sube_Sube_Kd[0] === enteredCode) {
                    this.selectedSubeObj = val;
                    this.forceUpdate();
                    break;
                }
            }

            if (!this.selectedSubeObj) {
                this.errorMessage = enteredCode + " kodunda bir şube bulunmamaktadır";
                this.forceUpdate();
            }
        }
    };

    // todo : for input numeric value and trigger enter
    onKeyPressSubeInput = (event) => {
        this.clearAutoComplete();

        //todo : numeric values
        if (event.which !== 8 && event.which !== 0 && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
        //todo : on enter
        if (event.keyCode || event.which === 13) {
            this.getSubeBySubeKodu(this.refInputSubeKod.current.value);
        }
    };

    onWindowKeyDown = (event) => {
        if(this.shownValsAutoComplete &&this.shownValsAutoComplete.length > 0){
            if(event.keyCode === 40){
                // this.refAutoComplete.current.blur();
                // console.log("down");
                this.activeAutoCompleteNo++;
                if(this.activeAutoCompleteNo === this.shownValsAutoComplete.length){
                    this.activeAutoCompleteNo = 0;
                }
                this.forceUpdate();
            }
            else if(event.keyCode === 38){
                // this.refAutoComplete.current.blur();
                this.activeAutoCompleteNo--;
                if(this.activeAutoCompleteNo < 0){
                    this.activeAutoCompleteNo = this.shownValsAutoComplete.length-1;
                }
                this.forceUpdate();
                console.log("up");
            }
            else if(event.keyCode === 13){
                // console.log("this.activeAutoCompleteNo " , this.activeAutoCompleteNo );

                if(this.activeAutoCompleteNo > -1){
                    if(this.shownValsAutoComplete[this.activeAutoCompleteNo].Sube_KapanisTarihi_Tr) {
                        this.errorMessage = "Aradığını şube kapalıdır.";
                        this.forceUpdate();
                    }
                    else{
                        this.getSubeBySubeKodu(this.shownValsAutoComplete[this.activeAutoCompleteNo].Sube_Sube_Kd[0]);
                    }
                }
            }
        }

        if(event.keyCode === 27 && this.errorMessage){
            this.closeModal();
        }
    };

    //todo : back to filters screen
    backToFilters = () => {
        this.showMoreDetail = false;
        this.selectedSubeObj = null;
        this.manipulatedSubeDataArr = this.props.subeData;

        this.clearAutoComplete();

        this.forceUpdate();
    };

    //todo : closes modal
    closeModal = () => {
        this.errorMessage = null;
        this.forceUpdate();
    };

    clearAutoComplete = () => {
        if(this.shownValsAutoComplete.length>0 || this.activeAutoCompleteNo > -1) {
            // this.refAutoComplete.current.value = null;
            this.shownValsAutoComplete = [];
            this.activeAutoCompleteNo = -1;
            this.forceUpdate();
        }
    };

    render() {
        return (
            <Fragment>
                <header>
                    <h1>ŞUBE ARAMA</h1>
                    <h2>Aradığınız şubenin şube kodu ile arama yapabilir, şube adı/ili/kod bilgileri ile sorgulayabilir
                        ya da il filtresini kullanarak istediğiniz ildeki şubeyi seçip bilgilerini getirebilirsiniz.</h2>
                </header>

                <section className="content-container">

                    {this.selectedSubeObj === null ?
                        <Fragment>
                            <div className="filter-container">

                                <div className="filter-block">
                                    {this.manipulatedSubeDataArr &&
                                    <Fragment>
                                        <div className="input-block">
                                            <label>Şube Kodu ile Arama</label>
                                            <input
                                                ref={this.refInputSubeKod}
                                                type="text"
                                                maxLength="4"
                                                onKeyPress={this.onKeyPressSubeInput}
                                                placeholder="Şube Kodu"
                                            />
                                            <input
                                                onClick={() => {
                                                    this.getSubeBySubeKodu(this.refInputSubeKod.current.value)
                                                }}
                                                type="button"
                                                value="ŞUBE GETİR"
                                            />
                                        </div>

                                        <div className="input-block">
                                            <label>Şube İline Göre Arama</label>
                                            <select onChange={this.onChangeCity}>
                                                <option value="">BÜTÜN İLLER</option>
                                                {Object.keys(CITIES_DATA.CITIES).map((city, i) => (
                                                    <option key={i}
                                                            value={city}
                                                    >{CITIES_DATA.CITIES[city.toString()]}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-block">
                                            <label>Şube Adı</label>
                                            <select onChange={this.onChangeSube}
                                                    ref={this.refSelectSube}
                                            >
                                                <option value="">Seçiniz</option>
                                                {this.manipulatedSubeDataArr.map((sube, i) => (
                                                    <option key={i}
                                                            value={sube.Sube_Adi_Ad}
                                                            className={sube.Sube_KapanisTarihi_Tr ? 'closed' : ''}
                                                    >{sube.Sube_Adi_Ad}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-block autocomplete-container">
                                            <label>Şube Adı / Kodu / İli</label>

                                            <input onKeyUp={this.onKeyUp}
                                                   ref={this.refAutoComplete}
                                                   type="text"
                                                   placeholder="Şube Adı / Kodu / İli"
                                                   onKeyPress={()=>{
                                                       // this.activeAutoCompleteNo = -1;
                                                   }}
                                            />

                                            {/*<span>BULUNAN ŞUBE SAYISI : {this.shownValsAutoComplete.length}</span>*/}
                                            {(this.shownValsAutoComplete && this.shownValsAutoComplete.length > 0) &&

                                            <div className="autocomplete-result-block">
                                                <Fragment>
                                                    {this.shownValsAutoComplete.map((val, i) => (
                                                        <div
                                                            className={`autocomplete-result-item ${this.activeAutoCompleteNo === i ? 'active' : ''} ${val.Sube_KapanisTarihi_Tr ? 'closed' : ''}`}
                                                             key={i}
                                                             onClick={() => {
                                                                 if(val.Sube_KapanisTarihi_Tr){
                                                                     this.errorMessage = "Aradığınız şube kapalıdır.";
                                                                     this.forceUpdate();
                                                                 }
                                                                 else{
                                                                     this.getSubeBySubeKodu(val.Sube_Sube_Kd[0])
                                                                 }
                                                             }}
                                                        >
                                                            {val.combinedAutoCompleteVal}
                                                        </div>
                                                    ))}
                                                </Fragment>
                                            </div>
                                            }

                                        </div>
                                    </Fragment>
                                    }


                                </div>

                            </div>

                        </Fragment>
                        :
                        <div className="sube-detail-container">
                            <div className="sube-detail-block">

                                <div className="sube-detail-item">
                                    <span><strong>Şube Kodu : </strong></span>
                                    <span>{this.selectedSubeObj.Sube_Sube_Kd}</span>
                                </div>

                                <div className="sube-detail-item">
                                    <span><strong>Şube Adı : </strong></span>
                                    <span>{this.selectedSubeObj.Sube_Adi_Ad}</span>
                                </div>

                                <div className="sube-detail-item">
                                    <span><strong>Şubenin Bulunduğu İl : </strong></span>
                                    <span>{Helper.getCityNameByNo(this.selectedSubeObj.Sube_Il_Kd)}</span>
                                </div>

                            </div>

                            <div className="sube-detail-button-block">
                                <input type='button'
                                       onClick={this.backToFilters}
                                       value="Filtreleme Sayfasına Geri Dön"
                                />

                                <input type='button'
                                       onClick={() => {
                                           this.showMoreDetail = !this.showMoreDetail;
                                           this.forceUpdate();
                                       }}
                                       value={this.showMoreDetail === true ?
                                           'Daha az bilgi göster'
                                           :
                                           'Daha fazla bilgi göster'
                                       }
                                />
                            </div>


                            <div className="sube-detail-block">
                                {this.showMoreDetail === true &&
                                <Fragment>
                                    {Object.keys(this.selectedSubeObj).map((val, i) => (
                                        <div className="sube-detail-item" key={i}>
                                            <span><strong>{Helper.removeUnderScoresFromStr(val)} :</strong></span>
                                            <span>{this.selectedSubeObj[val]}</span>
                                        </div>
                                    ))}
                                </Fragment>
                                }
                            </div>


                        </div>
                    }

                    {this.errorMessage &&
                    <div className="modal">

                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="close" onClick={this.closeModal}>&times;</span>
                                <h2>HATA</h2>
                            </div>

                            <div className="modal-body">
                                <p>{this.errorMessage}</p>
                            </div>

                        </div>

                    </div>
                    }

                    {this.isLoading === true &&
                    <div className="modal">

                        <div className="modal-content">
                            <div className="modal-body">
                                <p>Yükleniyor...</p>
                            </div>

                        </div>

                    </div>
                    }

                </section>

            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps, dispatch) => ({
    subeData: state.subeReducer.SUBELER ? state.subeReducer.SUBELER.SUBELER : []
});

export default connect(mapStateToProps)(SubeComponent);

