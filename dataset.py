import requests
import xlrd
import pandas as pd
from lxml import html

def cell2float(x):
    """Get cell value as float. If there is no data, such as some P/E, returns None."""
    try:
        return float(x.value)
    except ValueError as e:
        # print("Can't convert to float: {}".format(x))
        pass
    return None # Or 0.0 float(0.0)

def ts_date(df): 
    """Parse cell data. Also produce other features such as Day of Week, Day of Month."""
    cell2date = lambda x: xlrd.xldate_as_datetime(x.value, 0)
    date2dow = lambda x: x.date() # Day of Week
    
    df['Date'] = df.Date.apply(cell2date)
    df['TradingDay'] = df['Date'].apply(date2dow)
    df = df.set_index('TradingDay')
    return df

def ts_floats(df, cols):
    """Make float values for columns named in cols"""
    for c in cols:
        try:
            df[c] = df[c].apply(cell2float)
        except ValueError as e:
            print("Mapping to Floats Error in Column {} \nFrame:{}".format(c, df.head()))
    return df

class HistoricalTrading:
    def __init__(self, symbol, dataFolder=None):
        self.symbol = symbol
        
        try:
            self.workbook = xlrd.open_workbook("%s/HistoricalTrading.xlsx" % symbol)
        except IOError:
            self.workbook = pd.read_html("%s/HistoricalTrading.xls" % symbol)
        self._df = self.dataframe()
        
    @property
    def df(self):
        """Shorthand to current dataframe"""
        return self._df

    @property
    def worksheet(self):
        return self.workbook.sheet_by_index(0)

    def dataframe(self, clean=True):
        """Returns data frame indexed by daily trading date. Convert to floats / clean if clean flag is set."""
        # Worksheet is the first one in Workbook
        sh = self.worksheet

        # Header label at row 29th
        headers = [hname.value for hname in sh.row(29)]

        # Data row starts from row 30th to 3 lines before end of file
        data_rows = []
        for k in range(30, sh.nrows):
            # Check row-level correctness
            # Each data row should have 29 values
            assert(len(sh.row(k))==29)
            data_rows.append(sh.row(k))

        # Create dataframe
        df = pd.DataFrame(data_rows, columns=headers)

        df = df[:-3] # Remove last three lines

        # Date column is a date. This will be index for time-series data frame
        df = ts_date(df)
        
        # Convert values to floats and clean data frame
        if clean:
            df = ts_floats(df, ['Prior', 'Open', 'High', 'Low', 'Close', 'Average', 'Change', '%Change'])

            df = ts_floats(df, ['P/BV', 'Listed Shares', '%Volume Turnover'])

            df = ts_floats(df, ['Total Volume (k.Shares)', 'P/E', 'Market Cap. (M.Baht)'])

            df = ts_floats(df, ['Bid', 'Offer'])
        
        return df
    
    def timeseries(self):
        ts = {}
        # Daily average price
        ts['daily_averages'] = self._df[['Date','Average']].set_index('Date')

        # Spread daily, Offer - Bid
        daily_spreads = self._df[['Date', 'Bid', 'Offer']].set_index('Date')
        daily_spreads['Spread'] = daily_spreads['Offer'] - daily_spreads['Bid']
        ts['daily_spreads'] = daily_spreads
        
        # Create Daily returns dataframe
        ts['daily_returns'] = self._df[['Date','%Change']].set_index('Date')
        
        # Create Daily P/E dataframe
        ts['daily_pe'] = self._df[['Date','P/E']].set_index('Date')
        
        # Create Daily market cap dataframe
        ts['daily_marketcap'] = self._df[['Date', 'Market Cap. (M.Baht)']].set_index('Date')
        
        return ts
        
    def dump_lines(self):
        sh = self.workbook.sheet_by_index(0)
        print("{0} {1} {2}".format(sh.name, sh.nrows, sh.ncols))
        print("Cell D30 is {0}".format(sh.cell_value(rowx=29, colx=3)))
        for rx in range(sh.nrows):
            print(sh.row(rx))
    
    def plot_all(self):  
        ts = self.timeseries()

        daily_returns = ts['daily_returns']
        daily_averages = ts['daily_averages']
        daily_pe = ts['daily_pe']
        daily_marketcap = ts['daily_marketcap']
        daily_spreads = ts['daily_spreads']

        # Construct daily returns dataframe
        daily_returns.plot()
        daily_averages.plot()
        daily_pe.plot()
        daily_marketcap.plot()
        daily_spreads.plot()
    
    def __repr__(self):
        return """<HistoricalTrading {}>""".format(self.symbol)

class Factsheet:
    urlTemplate = "https://www.set.or.th/set/factsheet.do?symbol=%s&ssoPageId=3&language=th&country=TH"
    def __init__(self, symbol):
        self.symbol = symbol
        self.url = self.urlTemplate % symbol
        r = requests.get(self.url)
        print(r.status_code, r.encoding)
        self.data = r.text
        self.tree = html.fromstring(r.content)
        
        
        page = self.tree.xpath('/html/body/table')[0].getchildren()[2].getchildren()[0].getchildren()[1]
        
        # Price (บาท)
        # 52 Week High/Low
        # P/E (X)
        # P/BV (X)
        # Paid-up (ลบ.)
        # Market Cap (ลบ.)
        box = page.getchildren()[1].getchildren()[0].getchildren()[0].getchildren()
        # print(box)
        
        # .getchildren()[0].getchildren()[0].getchildren()
        row1 = box[0]
        row2 = box[1]
        # Get value row-by-row
        # print(row1.xpath('td')[6].text_content())
        # Price (บาท)
        price_label = row1.xpath('td')[0].text_content()
        price_value = row2.xpath('td')[0].text_content()
        # 52 Week High/Low
        # print(row1.xpath('td')[1].text_content())
        range52wk_label = row1.xpath('td')[1].text_content()
        range52wk_value = row2.xpath('td')[1].text_content()
        # P/E (X)
        # print(row1.xpath('td')[2].text_content())
        pe_label = row1.xpath('td')[2].text_content()
        pe_value = row2.xpath('td')[2].text_content()
        # P/BV (X)
        # print(row1.xpath('td')[3].text_content())
        pb_label = row1.xpath('td')[3].text_content()
        pb_value = row2.xpath('td')[3].text_content()
        # Paid-up (ลบ.)
        # print(row1.xpath('td')[4].text_content())
        paidup_label = row1.xpath('td')[4].text_content()
        paidup_value = row2.xpath('td')[4].text_content()
        # Market Cap (ลบ.)
        # print(row1.xpath('td')[5].text_content())
        marketcap_label = row1.xpath('td')[5].text_content()
        marketcap_value = row2.xpath('td')[5].text_content()
        
        self.value = {}
        self.value[price_label] = price_value
        self.value[range52wk_label] = range52wk_value
        self.value[pe_label] = pe_value
        self.value[pb_label] = pb_value
        self.value[paidup_label] = paidup_value
        self.value[marketcap_label] = marketcap_value
        
        # print(price_label, price_value)

if __name__ == '__main__':
    import os, os.path
    HOME = os.path.join(".", '[SETSmart] SET100 Prices 2015-2019', 'SET100_Data')
    os.chdir(HOME)
    htdat = HistoricalTrading('TASCO')
    htdat.dataframe()
    htdat.plot_all()