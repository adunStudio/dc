/**
 * Created by hong on 2016-06-20.
 */

const phaser = require('../lib/phaser.js');
const s_type = 'search_all';    // 무조건 전체 검색

(function() {
    var id = 'programming';  // default
    var searchMode = false;   // 검색모드(초기 false)
    var searchReady = true;   // 무한스크롤 비동기를 위한 검색 ready (비동기 함수가 끝나면 true)
    var s_keyword = '';       // 검색 키워드

    var page = {
        startPage: 1,
        currentPage: 1,
        endPage: 15,
        init: function() {
            this.startPage = 1;
            this.currentPage = 1;
            this.endPage = 15;
        }
    };

    function getList(page) {
        phaser.list(id, page, function(arrayList) {
            $('#list').empty();
            $('#list_tmp').tmpl(arrayList).appendTo('#list');
        });
    }

    function getSearch(page, s_type, s_keyword) {
        phaser.search(id, page, s_type, s_keyword, function(arrayList) {
            if(page == 1) {
                $('#list').empty();
            }
            $('#list_tmp').tmpl(arrayList).appendTo('#list');
            if(!arrayList.length == 0) {
                searchReady = true;
            }
        });
    }

    function getView(idx) {
        phaser.view(id, idx, 1, function(view) {
            $('#viewModal').modal('show');
            setView(view);
        });
    }

    function getComment(idx) {
        phaser.comment(id, idx, function(commentList) {
            $('#comment_table').empty();
            $('#comment_tmp').tmpl(commentList).appendTo('#comment_table');
        });
    }

    function postComment(idx, string) {
        phaser.comment_write(id, idx, string, function(no) {
            getComment(no);
        });
    }

    function postWrite(string) {
        phaser.write(id, string);
    }

    function setView(viewArray) {
        $('#view_idx').val(viewArray['idx']);
        for (var key in viewArray) {
            $('#view_' + key).html(viewArray[key]);
        }
    }

    function getWritePage() {
        phaser.writePage(id, function(hidden) {
            console.log(hidden);
            $('#block_key').val(hidden.block_key);
            $('#ci_t').val(hidden.ci_t);
            $('#r_key').val(hidden.r_key);
        });
    }

    function getBlock(id, ci_t, block_key) {
        phaser.getBlock(id, ci_t, block_key, $.param({id: id, ci_t: ci_t, block_key: block_key}));
    }

    // 페이징 선택
    function makePagination() {
        var pagination = [];
        for(var i = page.startPage; i <= page.endPage; ++i) {
            if(i == page.currentPage) {
                pagination.push({page: i, active: 'active'});
            } else {
                pagination.push({page: i});
            }
        }
        $('#paging').empty();
        $('#pagination_tmp').tmpl(pagination).appendTo('#paging');

    }

    // 페이징 클릭
    var $pagination = $('#pagination');
    $pagination.on('click', 'li a', function(event) {
        event.preventDefault();
        $( 'html, body' ).animate( { scrollTop : 0 }, 400 );
        var tempPage = $(this).data('page');
        if(tempPage =='prev')
        {
            page.startPage = page.startPage - 15 > 0 ? page.startPage - 15 : 1;
            page.currentPage = page.startPage;
            page.endPage = page.startPage + 14;
        }
        else if(tempPage =='next')
        {
            page.startPage += 15;
            page.currentPage = page.startPage;
            page.endPage = page.startPage + 14;
        }
        else
        {
            page.currentPage = tempPage;
        }

        makePagination();
        getList(page.currentPage);
    });

    // 갤러리 셀렉트
    $('.selectpicker').on('change', function(event) {
        searchMode = false;
        id = $(this).val();
        $('#gall_id, #gall_id').val(id);
        var name = $(this).find('option:selected').text();
        $('#gall_name, #gall_name2, #gall_name3').text(name + " 갤러리");
        page.init();
        makePagination();
        $('#pagination').show();
        getList(1);
    });

    // 리스트 선택 -> 뷰
    $('#list').on('click', 'tr td a', function(event) {
        event.preventDefault();
        var idx = $(this).data('idx');
        getView(idx);
        getComment(idx);
    });

    $(document).mousedown(function(event){
        if(event.button == 2) {
            $('#viewModal').modal('hide');
            if(!searchMode) {
                getList(page.currentPage); // 페이이지초기화
            }
        }
    });

    // 검색 모드시 무한 스크롤
    $(document).scroll(function() {
        var maxHeight = $(document).height();
        var currentScroll = $(window).scrollTop() + $(window).height();

        if (searchMode && maxHeight <= currentScroll + 100) {
            // 비동기 상태
            if(searchReady) {
                searchReady = false;
                page.currentPage += 1;
                getSearch(page.currentPage, s_type, s_keyword);
            }

        }
    });

    // 검색 모드 true(시작) -> 무한 스크롤 모드
    $('#search_btn').on('click', function(event){
        event.preventDefault();
        $('#pagination').hide();
        s_keyword = $('#s_keyword').val();
        page.init();
        getSearch(1, s_type, s_keyword);
        $( 'html, body' ).animate( { scrollTop : 0 }, 400 );
        searchMode = true;
        searchReady = true;
    });


    $('#comment_btn').on('click', function(event) {
        event.preventDefault();
        if(!$('#comment_memo').val() || !$('#comment_nick').val() || !$('#comment_pw').val()) {
            return;
        }
        var f = $('#comment_write');
        var idx = $('#view_idx').val();
        var s = f.serialize();
        $('#comment_memo').val('');
        postComment(idx, s);
    });

    $('#write_btn').on('click', function() {
        $('#writeModal').modal('show');
        getWritePage();
    });

    $('#write_comfirm_btn').on('click', function(event) {
        event.preventDefault();
        if(!$('#name').val() || !$('#password').val() || !$('#subject').val() || !$('#memo')) {
            return;
        }
        //var f = $('#write');
        //var s = f.serialize();
        getBlock($('#gall_id2').val(), $('#ci_t').val(), $('#block_key').val())
    });


    getList(1);
})();



