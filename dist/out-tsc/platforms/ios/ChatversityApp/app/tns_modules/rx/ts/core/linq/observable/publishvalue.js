/// <reference path="./multicast.ts" />
(function () {
    var o;
    var oc;
    var is;
    var s;
    var a;
    oc = o.publishValue(12);
    o = o.publishValue(function (a) { return a.asObservable(); }, 12);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaHZhbHVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvcngvdHMvY29yZS9saW5xL29ic2VydmFibGUvcHVibGlzaHZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1QztBQWdDdkMsQ0FBQztJQUNHLElBQUksQ0FBd0IsQ0FBQztJQUM3QixJQUFJLEVBQW9DLENBQUM7SUFDekMsSUFBSSxFQUF1QixDQUFDO0lBQzVCLElBQUksQ0FBcUIsQ0FBQztJQUMxQixJQUFJLENBQXdCLENBQUM7SUFFN0IsRUFBRSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQWhCLENBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9tdWx0aWNhc3QudHNcIiAvPlxubW9kdWxlIFJ4IHtcbiAgICBleHBvcnQgaW50ZXJmYWNlIE9ic2VydmFibGU8VD4ge1xuICAgICAgICAvKipcbiAgICAgICAgKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGludm9raW5nIHRoZSBzZWxlY3RvciBvbiBhIGNvbm5lY3RhYmxlIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBzaGFyZXMgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHRvIHRoZSB1bmRlcmx5aW5nIHNlcXVlbmNlIGFuZCBzdGFydHMgd2l0aCBpbml0aWFsVmFsdWUuXG4gICAgICAgICogVGhpcyBvcGVyYXRvciBpcyBhIHNwZWNpYWxpemF0aW9uIG9mIE11bHRpY2FzdCB1c2luZyBhIEJlaGF2aW9yU3ViamVjdC5cbiAgICAgICAgKlxuICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICogdmFyIHJlcyA9IHNvdXJjZS5wdWJsaXNoVmFsdWUoNDIpO1xuICAgICAgICAqIHZhciByZXMgPSBzb3VyY2UucHVibGlzaFZhbHVlKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnNlbGVjdChmdW5jdGlvbiAoeSkgeyByZXR1cm4geSAqIHk7IH0pIH0sIDQyKTtcbiAgICAgICAgKlxuICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZWxlY3Rvcl0gT3B0aW9uYWwgc2VsZWN0b3IgZnVuY3Rpb24gd2hpY2ggY2FuIHVzZSB0aGUgbXVsdGljYXN0ZWQgc291cmNlIHNlcXVlbmNlIGFzIG1hbnkgdGltZXMgYXMgbmVlZGVkLCB3aXRob3V0IGNhdXNpbmcgbXVsdGlwbGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgc291cmNlIHNlcXVlbmNlLiBTdWJzY3JpYmVycyB0byB0aGUgZ2l2ZW4gc291cmNlIHdpbGwgcmVjZWl2ZSBpbW1lZGlhdGVseSByZWNlaXZlIHRoZSBpbml0aWFsIHZhbHVlLCBmb2xsb3dlZCBieSBhbGwgbm90aWZpY2F0aW9ucyBvZiB0aGUgc291cmNlIGZyb20gdGhlIHRpbWUgb2YgdGhlIHN1YnNjcmlwdGlvbiBvbi5cbiAgICAgICAgKiBAcGFyYW0ge01peGVkfSBpbml0aWFsVmFsdWUgSW5pdGlhbCB2YWx1ZSByZWNlaXZlZCBieSBvYnNlcnZlcnMgdXBvbiBzdWJzY3JpcHRpb24uXG4gICAgICAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBwcm9kdWNlZCBieSBtdWx0aWNhc3RpbmcgdGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoaW4gYSBzZWxlY3RvciBmdW5jdGlvbi5cbiAgICAgICAgKi9cbiAgICAgICAgcHVibGlzaFZhbHVlKGluaXRpYWxWYWx1ZTogVCk6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPjtcbiAgICAgICAgLyoqXG4gICAgICAgICogUmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBpbnZva2luZyB0aGUgc2VsZWN0b3Igb24gYSBjb25uZWN0YWJsZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgc2hhcmVzIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiB0byB0aGUgdW5kZXJseWluZyBzZXF1ZW5jZSBhbmQgc3RhcnRzIHdpdGggaW5pdGlhbFZhbHVlLlxuICAgICAgICAqIFRoaXMgb3BlcmF0b3IgaXMgYSBzcGVjaWFsaXphdGlvbiBvZiBNdWx0aWNhc3QgdXNpbmcgYSBCZWhhdmlvclN1YmplY3QuXG4gICAgICAgICpcbiAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAqIHZhciByZXMgPSBzb3VyY2UucHVibGlzaFZhbHVlKDQyKTtcbiAgICAgICAgKiB2YXIgcmVzID0gc291cmNlLnB1Ymxpc2hWYWx1ZShmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5zZWxlY3QoZnVuY3Rpb24gKHkpIHsgcmV0dXJuIHkgKiB5OyB9KSB9LCA0Mik7XG4gICAgICAgICpcbiAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2VsZWN0b3JdIE9wdGlvbmFsIHNlbGVjdG9yIGZ1bmN0aW9uIHdoaWNoIGNhbiB1c2UgdGhlIG11bHRpY2FzdGVkIHNvdXJjZSBzZXF1ZW5jZSBhcyBtYW55IHRpbWVzIGFzIG5lZWRlZCwgd2l0aG91dCBjYXVzaW5nIG11bHRpcGxlIHN1YnNjcmlwdGlvbnMgdG8gdGhlIHNvdXJjZSBzZXF1ZW5jZS4gU3Vic2NyaWJlcnMgdG8gdGhlIGdpdmVuIHNvdXJjZSB3aWxsIHJlY2VpdmUgaW1tZWRpYXRlbHkgcmVjZWl2ZSB0aGUgaW5pdGlhbCB2YWx1ZSwgZm9sbG93ZWQgYnkgYWxsIG5vdGlmaWNhdGlvbnMgb2YgdGhlIHNvdXJjZSBmcm9tIHRoZSB0aW1lIG9mIHRoZSBzdWJzY3JpcHRpb24gb24uXG4gICAgICAgICogQHBhcmFtIHtNaXhlZH0gaW5pdGlhbFZhbHVlIEluaXRpYWwgdmFsdWUgcmVjZWl2ZWQgYnkgb2JzZXJ2ZXJzIHVwb24gc3Vic2NyaXB0aW9uLlxuICAgICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAgICAgICovXG4gICAgICAgIHB1Ymxpc2hWYWx1ZTxUUmVzdWx0PihzZWxlY3RvcjogKHNvdXJjZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlPFRSZXN1bHQ+LCBpbml0aWFsVmFsdWU6IFQpOiBPYnNlcnZhYmxlPFRSZXN1bHQ+O1xuICAgIH1cbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBvOiBSeC5PYnNlcnZhYmxlPG51bWJlcj47XG4gICAgdmFyIG9jOiBSeC5Db25uZWN0YWJsZU9ic2VydmFibGU8bnVtYmVyPjtcbiAgICB2YXIgaXM6IFJ4LklTdWJqZWN0PG51bWJlcj47XG4gICAgdmFyIHM6IFJ4LlN1YmplY3Q8bnVtYmVyPjtcbiAgICB2YXIgYTogUnguT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4gICAgb2MgPSBvLnB1Ymxpc2hWYWx1ZSgxMik7XG4gICAgbyA9IG8ucHVibGlzaFZhbHVlKGEgPT4gYS5hc09ic2VydmFibGUoKSwgMTIpO1xufSk7XG4iXX0=