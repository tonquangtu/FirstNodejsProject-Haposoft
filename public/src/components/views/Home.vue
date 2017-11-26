<template>
    <div class="main-container">
        <section class="prm-main-banner">
            <div class="container">
                <div class="left-banner">
                    <h3 class="title-banner">
                        <img src="images/Icon-cmt.png" alt="">
                        有料相談専用ツール
                    </h3>
                    <h4>相談を受け付ける人</h4>
                    <p>URLを知らせるだけで簡単に有料相談を受け付けられます。専門知識をマネタイズできます。</p>
                    <h4>相談したい人</h4>
                    <p>チケットを購入して、簡単にメッセージで相談することができます。付加価値の高いコンサルティングが受けられます。</p>
                    <a href="#" class="global-btn">いますぐ始める</a>
                </div>
                <div class="right-banner">
                    <img src="images/banner.jpg" alt="">
                </div>
            </div>
        </section>
        <section class="prm-consultation">
            <div class="container">
                <div class="prm-title-03">
                    <h3>簡単に相談</h3>
                    <p>相談したい人を見つけて、チケットを購入して、相談するだけ。付加価値の高い相談が気軽に受けられます。</p>
                </div>
                <div class="content">
                    <div class="row">
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-01 text-center">
                                <img src="images/Icon1.png" alt="">
                                <h4 class="title">Text</h4>
                                <p>Text Text TextTextText TextText TextText TextTextTextTextTextTextTextTextTextTextTextText</p>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-01 text-center">
                                <img src="images/Icon2.png" alt="" style="margin-top: 17px">
                                <h4 class="title">Text</h4>
                                <p>Text Text TextTextText TextText TextText TextTextTextTextTextTextTextTextTextTextTextText</p>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-01 text-center">
                                <img src="images/Icon5.png" alt="">
                                <h4 class="title">Text</h4>
                                <p>Text Text TextTextText TextText TextText TextTextTextTextTextTextTextTextTextTextTextText</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <a href="#" class="global-btn style-03">いますぐ始める</a>
                    </div>
                </div>
            </div>
        </section>
        <section class="prm-consultation style-02">
            <div class="container">
                <div class="prm-title-03">
                    <h3>専門家として相談受付</h3>
                    <p>自分で料金設定をして、相談を受け、料金を受け取ることができます。あなたの専門知識を活かしましょう。</p>
                </div>
                <div class="content">
                    <div class="row">
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-01 text-center">
                                <img src="images/Icon4.png" alt="">
                                <h4 class="title">Text</h4>
                                <p>Text Text TextTextText TextText TextText TextTextTextTextTextTextTextTextTextTextTextText</p>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-01 text-center">
                                <img src="images/Icon5.png" alt="">
                                <h4 class="title">Text</h4>
                                <p>Text Text TextTextText TextText TextText TextTextTextTextTextTextTextTextTextTextTextText</p>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-01 text-center">
                                <img src="images/Icon6.png" alt="">
                                <h4 class="title">Text</h4>
                                <p>Text Text TextTextText TextText TextText TextTextTextTextTextTextTextTextTextTextTextText</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <a href="#" class="global-btn style-03">いますぐ始める</a>
                    </div>
                </div>
            </div>
        </section>
        <section class="prm-pick-up">
            <div class="container">
                <div class="prm-title-03">
                    <h3>PICK UP</h3>
                    <p>相談したい人を見つけて、チケットを購入して、相談するだけ。</p>
                </div>
                <div class="content">
                    <div class="row">
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-specialist text-center">
                                <div class="thumb">
                                    <img src="images/avt.png" alt="">
                                </div>
                                <h3 class="name-specialist">Takafumi Horie</h3>
                                <p class="position">職業肩書き</p>
                                <p class="label-specialist"><i class="ti-tag"></i>ビジネス</p>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-specialist text-center">
                                <div class="thumb">
                                    <img src="images/avt.png" alt="">
                                </div>
                                <h3 class="name-specialist">Takafumi Horie</h3>
                                <p class="position">職業肩書き</p>
                                <p class="label-specialist"><i class="ti-tag"></i>ビジネス</p>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4 col-xs-12">
                            <div class="prm-item-specialist text-center">
                                <div class="thumb">
                                    <img src="images/avt.png" alt="">
                                </div>
                                <h3 class="name-specialist">Takafumi Horie</h3>
                                <p class="position">職業肩書き</p>
                                <p class="label-specialist"><i class="ti-tag"></i>ビジネス</p>
                            </div>
                        </div>

                    </div>
                    <div class="text-center">
                        <router-link :to="{name: 'pickup_expert'}" class="global-btn style-03">いますぐ始める</router-link>
                    </div>
                </div>
            </div>
            <div id="back-top" class="pull-right"><i class="ti-arrow-circle-up"></i></div>
            <div class="clearfix"></div>
        </section>
    </div>
</template>